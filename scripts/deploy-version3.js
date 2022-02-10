/* global ethers */
/* eslint prefer-const: "off" */

require('dotenv').config()

const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')

async function deployVersion2 (address = null) {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]

  let diamondAddress = address
  if (!diamondAddress) {
    diamondAddress = process.env.DIAMOND_ADDRESS
  }


  const Facet = await ethers.getContractFactory('Version3Facet')
  const facet = await Facet.deploy()
  await facet.deployed()

  const diamondCut = await ethers.getContractAt('IDiamondCut', diamondAddress)
  let tx = await diamondCut.diamondCut(
    [{
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet)
    }], ethers.constants.AddressZero, '0x')
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`V3 Upgrade failed: ${tx.hash}`)
  }
  console.log('Completed v3 upgrade')
  return facet.address
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployVersion2()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

exports.deployVersion2 = deployVersion2
