import React from "react";
import { render, fireEvent, act } from "test_utils";
import { PublicKeyForm } from "./PublicKeyForm";

const publicKeys = [
  { key: "ssh key some long key name", name: "MyFirstKey.pub" },
  {
    key: "ssh second key with some long key name",
    name: "MySecondKey.pub",
  },
  {
    key: "ssh wow this key is very good totally secure",
    name: "MyThirdKey.pub",
  },
];

const defaultData = {
  publicKey: {
    name: "",
    key: "",
  },
  savePublicKey: false,
};
describe("publicKeyForm", () => {
  it("public Key state should be initialized correctly", async () => {
    let data = { ...defaultData };
    const updateData = jest.fn((x) => {
      data = x;
    });

    render(
      <PublicKeyForm
        publicKeys={publicKeys}
        data={data}
        onChange={updateData}
      />
    );
    expect(data).toStrictEqual(defaultData);
  });

  it("selecting a public key from the dropdown should select it", async () => {
    let data = { ...defaultData };
    const updateData = jest.fn((x) => {
      data = x;
    });

    const { queryByDataCy, getAllByText } = render(
      <PublicKeyForm
        publicKeys={publicKeys}
        data={data}
        onChange={updateData}
      />
    );
    fireEvent.mouseDown(queryByDataCy("public_key_dropdown").firstElementChild);
    const selectChoice = getAllByText("MyFirstKey.pub")[1];
    expect(selectChoice).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(selectChoice);
    });
    expect(data).toStrictEqual({
      publicKey: { ...publicKeys[0] },
      savePublicKey: false,
    });
  });

  it("clicking on Add new key should reset the state to the default", async () => {
    const defaultState = {
      publicKey: { ...publicKeys[0] },
      savePublicKey: false,
    };
    let data = { ...defaultData };

    const updateData = jest.fn((x) => {
      data = x;
    });

    const { queryByDataCy } = render(
      <PublicKeyForm
        publicKeys={publicKeys}
        data={data}
        onChange={updateData}
      />
    );
    expect(data).toStrictEqual(defaultData);
    expect(queryByDataCy("add_new_key_form")).toBeNull();
    updateData(defaultState);
    expect(data).toStrictEqual(defaultState);
    fireEvent.click(queryByDataCy("add_public_key_button"));
    expect(queryByDataCy("add_new_key_form")).toBeInTheDocument();
    expect(data).toStrictEqual(defaultData);
  });

  it("toggling add new key should disable and enable the select input", async () => {
    const defaultState = {
      publicKey: { ...publicKeys[0] },
      savePublicKey: false,
    };
    let data = { ...defaultData };

    const updateData = jest.fn((x) => {
      data = x;
    });

    const { queryByDataCy } = render(
      <PublicKeyForm
        publicKeys={publicKeys}
        data={data}
        onChange={updateData}
      />
    );
    expect(data).toStrictEqual(defaultData);
    expect(queryByDataCy("add_new_key_form")).toBeNull();
    updateData(defaultState);
    expect(data).toStrictEqual(defaultState);
    fireEvent.click(queryByDataCy("add_public_key_button"));
    expect(queryByDataCy("add_new_key_form")).toBeInTheDocument();
    expect(queryByDataCy("public_key_dropdown")).toHaveClass(
      "ant-select-disabled"
    );
    fireEvent.click(queryByDataCy("add_public_key_button"));
    expect(queryByDataCy("add_new_key_form")).toBeNull();
    expect(queryByDataCy("public_key_dropdown")).not.toHaveClass(
      "ant-select-disabled"
    );
  });
});
