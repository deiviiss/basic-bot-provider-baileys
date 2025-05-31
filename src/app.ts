import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const PORT = process.env.PORT ?? 3008

const welcomeFlow = addKeyword<Provider, Database>(['hi', 'hello', 'hola'])
  .addAnswer(`🙌 Hello welcome to this *Chatbot*`)
  .addAction(async (_, { flowDynamic, provider }) => {

    // await fetch(`http://localhost:3008/v1/messages`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     number: '+5219811250049',
    //     message: `📦 Nuevo pedido confirmado`
    //   })
    // })

    await provider.sendMessage('+5219811250049', '📦 Nuevo pedido confirmado')

    await flowDynamic('Cada que escribas algo, le enviaremos un mensaje de confirmación al dueño del número. 😊')
  })

const main = async () => {
  const adapterFlow = createFlow([welcomeFlow])

  const adapterProvider = createProvider(Provider, {
    browser: ["Windows", "Chrome", "Chrome 114.0.5735.198"],
    version: [2, 3000, 1023223821],
    usePairingCode: false
  }

  )
  const adapterDB = new Database()

  const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  })

  adapterProvider.server.post(
    '/v1/messages',
    handleCtx(async (bot, req, res) => {
      const { number, message, urlMedia } = req.body
      await bot.sendMessage(number, message, { media: urlMedia ?? null })
      return res.end('sended')
    })
  )

  httpServer(+PORT)
}

main()
