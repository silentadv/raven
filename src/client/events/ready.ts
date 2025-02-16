import { makeEvent } from "@/lib/utils/factories/make-event";

export default makeEvent({
  name: "ready",
  once: true,
  handle(_, client) {
    console.log(`✅ Client are ready in user: ${client.user.username}.`);
  },
});
