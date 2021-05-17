import { Plugins } from "@capacitor/core";
const { LocalNotifications } = Plugins;

export const initNotifications: any = async (hour: number, minute: number) => {
  try {
    // Request/ check permissions
    if (!(await LocalNotifications.requestPermission()).granted) return;

    // Clear old notifications in prep for refresh (OPTIONAL)
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0)
      await LocalNotifications.cancel(pending);

    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Noticed anything different today",
          body: "...as you walk your nearby? We’d love to see it.",
          id: 1,
          schedule: { at: new Date(new Date().getTime() + 1209600000) }, // 2 weeks
        },
        {
          title: "We’ve not seen you in a while.",
          body: "Hope you’re enjoying Walksy. and you’d like to add your own walk soon.",
          id: 2,
          schedule: { at: new Date(new Date().getTime() + 2419200000) }, // 4 weeks
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
};

export const cancelNotifications: any = async () => {
  try {
    // Request/ check permissions
    if (!(await LocalNotifications.requestPermission()).granted) return;

    // Clear old notifications in prep for refresh (OPTIONAL)
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0)
      await LocalNotifications.cancel(pending);
  } catch (error) {
    console.error(error);
  }
};
