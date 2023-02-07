import { afterEach, describe, expect, it, jest, test } from "@jest/globals";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

import {
  getAllUsers,
  getOwnData,
  getUserById,
  updateUserById,
} from "../userController";
import userModel from "../../models/userModel";

const randomString = (len: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

describe("get all users controller", () => {
  const mReq = {} as Request;
  const mRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  } as any as Response;

  it("should show no users", async () => {
    jest.spyOn(userModel, "find").mockResolvedValueOnce([]);
    await getAllUsers(mReq, mRes);
    expect(mRes.status).toBeCalledWith(202);
    expect(mRes.json).toBeCalledWith([]);
  });

  it("should show one user", async () => {
    const mUserRecord = [
      { id: "1", email: "a@b", fname: "a", surname: "b", isAdmin: false },
    ];
    jest.spyOn(userModel, "find").mockResolvedValueOnce(mUserRecord);
    await getAllUsers(mReq, mRes);
    expect(mRes.status).toBeCalledWith(202);
    expect(mRes.json).toBeCalledWith(mUserRecord);
  });

  it("should show multiple users", async () => {
    const mUserRecord = [
      { id: "1", email: "a@b", fname: "a", surname: "b", isAdmin: false },
      { id: "2", email: "b@c", fname: "b", surname: "c", isAdmin: true },
      { id: "3", email: "c@d", fname: "c", surname: "d", isAdmin: false },
      { id: "4", email: "d@e", fname: "d", surname: "e", isAdmin: false },
      { id: "5", email: "e@f", fname: "e", surname: "f", isAdmin: true },
    ];
    jest.spyOn(userModel, "find").mockResolvedValueOnce(mUserRecord);
    await getAllUsers(mReq, mRes);
    expect(mRes.status).toBeCalledWith(202);
    expect(mRes.json).toBeCalledWith(mUserRecord);
  });

  it("should show multiple random users", async () => {
    const mUserRecord = [];
    for (let i = 0; i < 20; i++) {
      mUserRecord.push({
        id: randomString(20),
        email: randomString(10),
        fname: randomString(5),
        surname: randomString(7),
        isAdmin: i % 2 ? false : true,
      });
    }

    jest.spyOn(userModel, "find").mockResolvedValueOnce(mUserRecord);
    await getAllUsers(mReq, mRes);
    expect(mRes.status).toBeCalledWith(202);
    expect(mRes.json).toBeCalledWith(mUserRecord);
  });
});

describe("get user by id", () => {
  const mUsersRecord = [
    { id: "1", email: "a@b", fname: "a", surname: "b", isAdmin: false },
    { id: "2", email: "b@c", fname: "b", surname: "c", isAdmin: true },
    { id: "3", email: "c@d", fname: "c", surname: "d", isAdmin: false },
    { id: "4", email: "d@e", fname: "d", surname: "e", isAdmin: false },
    { id: "5", email: "e@f", fname: "e", surname: "f", isAdmin: true },
  ];

  const mRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  } as any as Response;

  it("get first user by id controller", async () => {
    jest.spyOn(userModel, "findById").mockResolvedValueOnce(mUsersRecord[0]);
    const mReq = { params: { id: "1" } } as any as Request;

    await getUserById(mReq, mRes);
    expect(mRes.status).toBeCalledWith(202);
    expect(mRes.json).toBeCalledWith(mUsersRecord[0]);
  });

  it("get third user by id", async () => {
    jest.spyOn(userModel, "findById").mockResolvedValueOnce(mUsersRecord[2]);
    const mReq = { params: { id: "3" } } as any as Request;

    await getUserById(mReq, mRes);
    expect(mRes.status).toBeCalledWith(202);
    expect(mRes.json).toBeCalledWith(mUsersRecord[2]);
  });

  it("expect null by passing wrong id", async () => {
    jest.spyOn(userModel, "findById").mockResolvedValueOnce(null);
    const mReq = { params: { id: "7" } } as any as Request;

    await getUserById(mReq, mRes);
    expect(mRes.status).toBeCalledWith(202);
    expect(mRes.json).toBeCalledWith(null);
  });

  it("expect error by passing invalid id format", async () => {
    jest
      .spyOn(userModel, "findById")
      .mockRejectedValueOnce({ name: "CastError" });
    const mReq = { params: { id: "abc" } } as any as Request;

    await getUserById(mReq, mRes);
    expect(mRes.status).toBeCalledWith(405);
    expect(mRes.send).toBeCalledWith({ name: "CastError" });
  });

  it("get random user if id matches", async () => {
    for (let i = 0; i < 20; i++) {
      const id = Math.floor(Math.random() * 10) + 1;
      if (id > 5) {
        jest
          .spyOn(userModel, "findById")
          .mockRejectedValueOnce({ name: "CastError" });
      } else {
        jest
          .spyOn(userModel, "findById")
          .mockResolvedValueOnce(mUsersRecord[id - 1]);
      }

      const mReq = { params: { id: `${id}` } } as any as Request;

      await getUserById(mReq, mRes);
      if (id > 5) {
        expect(mRes.status).toBeCalledWith(405);
        expect(mRes.send).toBeCalledWith({ name: "CastError" });
      } else {
        expect(mRes.status).toBeCalledWith(202);
        expect(mRes.json).toBeCalledWith(mUsersRecord[id - 1]);
      }
    }
  });
});

describe("get own data controller", () => {
  const mUsersRecord = [
    { id: "1", email: "a@b", fname: "a", surname: "b", isAdmin: false },
    { id: "2", email: "b@c", fname: "b", surname: "c", isAdmin: true },
    { id: "3", email: "c@d", fname: "c", surname: "d", isAdmin: false },
    { id: "4", email: "d@e", fname: "d", surname: "e", isAdmin: false },
    { id: "5", email: "e@f", fname: "e", surname: "f", isAdmin: true },
  ];

  const mReq = {} as Request;
  const mRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
    locals: { user: { id: "" } },
  } as any as Response;

  afterEach(() => {
    mRes.locals.user.id = "";
  });

  it("get first user by id controller", async () => {
    jest.spyOn(userModel, "findById").mockResolvedValueOnce(mUsersRecord[0]);
    mRes.locals.user.id = "1";

    await getOwnData(mReq, mRes);
    expect(mRes.status).toBeCalledWith(202);
    expect(mRes.json).toBeCalledWith(mUsersRecord[0]);
  });

  it("get third user by id", async () => {
    jest.spyOn(userModel, "findById").mockResolvedValueOnce(mUsersRecord[2]);
    mRes.locals.user.id = "3";

    await getOwnData(mReq, mRes);
    expect(mRes.status).toBeCalledWith(202);
    expect(mRes.json).toBeCalledWith(mUsersRecord[2]);
  });

  it("expect null by passing wrong id", async () => {
    jest.spyOn(userModel, "findById").mockResolvedValueOnce(null);
    mRes.locals.user.id = "7";

    await getOwnData(mReq, mRes);
    expect(mRes.status).toBeCalledWith(202);
    expect(mRes.json).toBeCalledWith(null);
  });

  it("expect error by passing invalid id format", async () => {
    jest
      .spyOn(userModel, "findById")
      .mockRejectedValueOnce({ name: "CastError" });
    mRes.locals.user.id = "abc";

    await getOwnData(mReq, mRes);
    expect(mRes.status).toBeCalledWith(405);
    expect(mRes.send).toBeCalledWith({ name: "CastError" });
  });

  it("get 20 random users if id matches", async () => {
    for (let i = 0; i < 20; i++) {
      const id = Math.floor(Math.random() * 10) + 1;
      if (id > 5) {
        jest
          .spyOn(userModel, "findById")
          .mockRejectedValueOnce({ name: "CastError" });
      } else {
        jest
          .spyOn(userModel, "findById")
          .mockResolvedValueOnce(mUsersRecord[id - 1]);
      }
      mRes.locals.user.id = `${id}`;

      await getOwnData(mReq, mRes);
      if (id > 5) {
        expect(mRes.status).toBeCalledWith(405);
        expect(mRes.send).toBeCalledWith({ name: "CastError" });
      } else {
        expect(mRes.status).toBeCalledWith(202);
        expect(mRes.json).toBeCalledWith(mUsersRecord[id - 1]);
      }
    }
  });
});

describe("update user by id controller", () => {
  const mDefaultRecord = [
    {
      id: "1",
      email: "a@b",
      password: "123",
      fname: "a",
      surname: "b",
      isAdmin: false,
      rentMovies: [],
    },
    {
      id: "2",
      email: "b@c",
      password: "234",
      fname: "b",
      surname: "c",
      isAdmin: true,
      rentMovies: [],
    },
    {
      id: "3",
      email: "c@d",
      password: "345",
      fname: "c",
      surname: "d",
      isAdmin: false,
      rentMovies: [],
    },
    {
      id: "4",
      email: "d@e",
      password: "456",
      fname: "d",
      surname: "e",
      isAdmin: false,
      rentMovies: [],
    },
    {
      id: "5",
      email: "e@f",
      password: "567",
      fname: "e",
      surname: "f",
      isAdmin: true,
      rentMovies: [],
    },
  ];
  let mUsersRecord = [...mDefaultRecord];

  let mRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
    locals: { user: { id: "", isAdmin: false } },
  } as any as Response;

  afterEach(() => {
    mRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
      locals: { user: { id: "", isAdmin: false } },
    } as any as Response;
  });

  it("update own name as admin", async () => {
    const mReq = {
      params: { id: "1" },
      body: { fname: "newName" },
    } as any as Request;

    mRes.locals.user = {
      id: "1",
      isAdmin: true,
    };

    jest.spyOn(userModel, "findById").mockResolvedValueOnce(mUsersRecord[0]);

    const { password, ...updatedData } = mUsersRecord[0];
    updatedData.fname = "newName";

    jest
      .spyOn(userModel, "findByIdAndUpdate")
      .mockResolvedValueOnce(updatedData);

    await updateUserById(mReq, mRes);
    expect(mRes.status).toBeCalledWith(200);
    expect(mRes.json).toBeCalledWith(updatedData);
  });

  it("updates all user data, but password as admin", async () => {
    const mReq = {
      params: { id: "2" },
      body: {
        fname: "newName",
        surname: "newSurname",
        email: "new@email",
        isAdmin: false,
      },
    } as any as Request;

    mRes.locals.user = {
      id: "2",
      isAdmin: true,
    };

    jest.spyOn(userModel, "findById").mockResolvedValueOnce(mUsersRecord[1]);

    let { password, ...updatedData } = mUsersRecord[1];
    updatedData = { ...updatedData, ...mReq.body };

    jest
      .spyOn(userModel, "findByIdAndUpdate")
      .mockResolvedValueOnce(updatedData);

    await updateUserById(mReq, mRes);
    expect(mRes.status).toBeCalledWith(200);
    expect(mRes.json).toBeCalledWith(updatedData);
  });

  it("update password as admin", async () => {
    const mReq = {
      params: { id: "3" },
      body: {
        newPassword: "newPsw",
      },
    } as any as Request;

    mRes.locals.user = {
      id: "1",
      isAdmin: true,
    };

    jest.spyOn(userModel, "findById").mockResolvedValueOnce(mUsersRecord[2]);

    const { password, ...updatedData } = mUsersRecord[2];

    jest
      .spyOn(userModel, "findByIdAndUpdate")
      .mockResolvedValueOnce(updatedData);

    await updateUserById(mReq, mRes);
    expect(mRes.status).toBeCalledWith(200);
    expect(mRes.json).toBeCalledWith(updatedData);
  });

  it("update own data as non admin", async () => {
    const mReq = {
      params: { id: "4" },
      body: {
        password: "123",
        fname: "newName",
      },
    } as any as Request;

    mRes.locals.user = {
      id: "4",
      isAdmin: false,
    };

    jest.spyOn(userModel, "findById").mockResolvedValueOnce(mUsersRecord[3]);

    const { password, ...updatedData } = mUsersRecord[3];

    jest.spyOn(bcrypt, "compareSync").mockReturnValueOnce(true);
    jest
      .spyOn(userModel, "findByIdAndUpdate")
      .mockResolvedValueOnce(updatedData);

    await updateUserById(mReq, mRes);
    expect(mRes.status).toBeCalledWith(200);
    expect(mRes.json).toBeCalledWith(updatedData);
  });
});
