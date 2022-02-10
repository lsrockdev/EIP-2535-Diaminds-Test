/* global ethers */
/* eslint prefer-const: "off" */

require('dotenv').config()

const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')

async function deployVersion3 (address = null) {
  const accounts = await ethers.getSigners()

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
      action: FacetCutAction.Replace,
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
  deployVersion3()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

exports.deployVersion3 = deployVersion3
