/* global describe it before ethers */


const { deployDiamond } = require('../scripts/deploy-version1.js')
const { deployVersion2 } = require('../scripts/deploy-version2.js')
const { deployVersion3 } = require('../scripts/deploy-version3.js')

const { assert, expect } = require('chai')
const { ethers } = require('hardhat')

describe('Version3', async function () {
  let diamondAddress

  before(async function () {
    diamondAddress = await deployDiamond()
    await deployVersion2(diamondAddress)
    await deployVersion3(diamondAddress)
  })

  it('set at wrong date', async () => {

    const timestamp = Math.floor(new Date().getTime() / 1000);

    const version1Facet = await ethers.getContractAt('Version1Facet', diamondAddress)
    await expect(version1Facet.setPrice(0, 20)).to.be.reverted;
  })

  it('set at exact date', async () => {

    const timestamp = Math.floor(new Date().getTime() / 1000);

    const version1Facet = await ethers.getContractAt('Version1Facet', diamondAddress)
    await expect(version1Facet.setPrice(timestamp, 20)).to.be.not.reverted;
  })

  it('set only owner', async () => {

    const timestamp = Math.floor(new Date().getTime() / 1000);

    const ownershipFacet = await ethers.getContractAt('OwnershipFacet', diamondAddress)
    await ownershipFacet.transferOwnership(ethers.constants.AddressZero)

    const version1Facet = await ethers.getContractAt('Version1Facet', diamondAddress)
    await expect(version1Facet.setPrice(timestamp, 20)).to.be.reverted;
  })
})
