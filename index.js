const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

const utils = require('./utils')
const { BigNumber } = require('@ethersproject/bignumber')
dotenv.config()
const PORT = process.env.PORT || 3001

const canvasConfig = {
  width: 390,
  height: 390,
}

const app = express()
app.use(cors())
app.use(express.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.use(bodyParser.json())

app.post('/generateNFT', async (req, res) => {
  const new_params = req.body
  console.log(BigNumber.from(new_params.tokenId).toString())
  await utils.generateNFT(
    {
      name: new_params.name,
      tokenId: BigNumber.from(new_params.tokenId).toString(),
    },
    canvasConfig,
  )

  res.status(200).json({
    message: 'succeed',
  })
})
//tell express that we want to use the www folder
//for our static assets
app.get('/', (req, res) => {
  // Read the database file and get all the lines in an array
  const databaseContent = fs.readFileSync('nft_list.txt', {
    encoding: 'utf8',
    flag: 'r',
  })
  const lines = utils.getLines(databaseContent)

  res.status(200).json({
    message: databaseContent,
  })
})
app.use(express.static(path.join(__dirname, '/')))

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))