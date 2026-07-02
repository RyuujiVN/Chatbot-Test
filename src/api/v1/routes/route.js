import chatRoute from "./chat.route.js"

const route = (app) => {
  const version = '/api/v1'

  app.use(version + "/chat", chatRoute)
}

export default route;