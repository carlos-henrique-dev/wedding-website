import { IDatabaseClient, IGuest, IGuestList, IMember } from "@/interfaces";
import { fireStoreInstance } from "@/config";

export class FireStoreAdapter implements IDatabaseClient {
  private readonly fireStore = fireStoreInstance;

  getOne = async (code: string) => {
    const result = await this.fireStore
      .collection("guests")
      .where("code", "==", code)
      .get();

    if (!result.docs[0]) {
      return null;
    }

    const data = result.docs[0]?.data() as IGuest;

    return data;
  };

  getCodes = async () => {
    const result = await this.fireStore
      .collection("guests")
      .select("code")
      .get();

    const data = result.docs.map((guest) => guest.data()) as IGuestList;

    return data;
  };

  getList = async () => {
    const result = await this.fireStore.collection("guests").get();

    const data = result.docs.map((guest) => guest.data()) as IGuestList;

    return data;
  };

  createInvite = async (guest: IGuest) => {
    const result = await this.fireStore.collection("guests").add(guest);

    const data = await result.get();

    return data.data() as IGuest;
  };

  updateInvite = async ({
    oldCode,
    ...guest
  }: IGuest & { oldCode: string }) => {
    const result = await this.fireStore
      .collection("guests")
      .where("code", "==", oldCode)
      .get();

    await result.docs[0].ref.update(guest);

    return guest;
  };

  deleteInvite = async (code: string) => {
    const result = await this.fireStore
      .collection("guests")
      .where("code", "==", code)
      .get();

    const data = result.docs[0].data() as IGuest;

    await result.docs[0].ref.delete();

    return data;
  };

  sendInvite = async (code: string) => {
    const result = await this.fireStore
      .collection("guests")
      .where("code", "==", code)
      .get();

    const data = result.docs[0].data() as IGuest;

    await result.docs[0].ref.update({ inviteSent: true });

    return data;
  };

  markAsSeen = async (code: string) => {
    const result = await this.fireStore
      .collection("guests")
      .where("code", "==", code)
      .get();

    const data = result.docs[0].data() as IGuest;

    const openedTimes = (data.openedTimes || 0) + 1;

    await result.docs[0].ref.update({ openedTimes });

    return data;
  };

  confirmPresence = async ({
    code,
    members,
  }: {
    code: string;
    members: Array<string>;
  }) => {
    const result = await this.fireStore
      .collection("guests")
      .where("code", "==", code)
      .get();

    const data = result.docs[0].data() as IGuest;

    const guest = {
      ...data,
      confirmed: true,
      members: data.members.map((member) => {
        const memberIndex = members.findIndex((m) => m === member.name);
        if (memberIndex === -1) return member;

        return {
          ...member,
          is_coming: true,
        };
      }),
    };

    await result.docs[0].ref.update(guest);

    return data;
  };

  confirmAbsence = async (code: string) => {
    const result = await this.fireStore
      .collection("guests")
      .where("code", "==", code)
      .get();

    const data = result.docs[0].data() as IGuest;

    const guest = {
      ...data,
      absent: true,
    };

    await result.docs[0].ref.update(guest);

    return data;
  };

  // USERS
  getUser = async (username: string) => {
    const result = await this.fireStore
      .collection("users")
      .where("username", "==", username)
      .get();

    if (!result.docs[0]) {
      return null;
    }

    const data = result.docs[0]?.data();

    return data;
  };
}
