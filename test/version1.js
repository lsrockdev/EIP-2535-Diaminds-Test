/* global describe it before ethers */


const { deployDiamond } = require('../scripts/deploy-version1.js')

const { assert } = require('chai')

describe('Version1', async function () {
  let diamondAddress

  before(async function () {
    diamondAddress = await deployDiamond()
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

  it('get avg price', async () => {

    const version1Facet = await ethers.getContractAt('Version1Facet', diamondAddress)
    await version1Facet.setPrice(0, 20);
    await version1Facet.setPrice(3*86400, 10);
    const res = await version1Facet.getAvgPrice(0, 3*86400)
    assert.equal(
      res,
      15
    )
  })
})
