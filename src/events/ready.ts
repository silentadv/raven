import { makeEvent } from "@/utils/factories/make-event";

export default makeEvent({
  name: "ready",
  once: true,
  handle(client) {
    console.log(`✅ Client are ready in user: ${client.user.username}.`);
  },
});
