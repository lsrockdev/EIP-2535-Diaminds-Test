/* global describe it before ethers */


const { deployDiamond } = require('../scripts/deploy-version1.js')
const { deployVersion2 } = require('../scripts/deploy-version2.js')

const { assert, expect } = require('chai')

describe('Version2', async function () {
  let diamondAddress

  before(async function () {
    diamondAddress = await deployDiamond()
    await deployVersion2(diamondAddress)
  })

  it('set/get price', async () => {

    const version1Facet = await ethers.getContractAt('Version1Facet', diamondAddress)
    await version1Facet.setPrice(0, 20);
    const res = await version1Facet.getPrice(0)
    assert.equal(
      res,
      20
    )
  })

  it('set only owner', async () => {

    const ownershipFacet = await ethers.getContractAt('OwnershipFacet', diamondAddress)
    await ownershipFacet.transferOwnership(ethers.constants.AddressZero)

    const version1Facet = await ethers.getContractAt('Version1Facet', diamondAddress)
    await expect(version1Facet.setPrice(0, 20)).to.be.reverted;
  })
})
