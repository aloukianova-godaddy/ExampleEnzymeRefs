import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Signup from "./Signup";

beforeAll(() => {
  Enzyme.configure({ adapter: new Adapter() });
});

describe("<Signup />", () => {
  it("should render as a form", () => {
    const createAccount = jest.fn();
    const wrapper = shallow(
      <Signup
        createAccount={createAccount}
      />
    );

    expect(wrapper.name()).toEqual("div");
  });

  it("should not submit with no inputs", () => {
    const createAccount = jest.fn();
    const wrapper = mount(
      <Signup
        createAccount={createAccount}
      />
    );

    wrapper.setProps({});
    expect(wrapper.instance().form.companyName).toBeDefined();
    wrapper.find("form").simulate("submit", { preventDefault() {} });

    expect(createAccount).toHaveBeenCalledTimes(0);
  });
  it("should submit with all inputs filled in", () => {
    const createAccount = jest.fn((data) => {
      return new Promise((resolve, reject) => {
        resolve("you did it", data);
      });
    });
    const wrapper = mount(
      <Signup
        createAccount={createAccount}
      />
    );

    wrapper.setProps({});

    wrapper.find("input").forEach(node => {
      node.instance().value = "fff";
    });

    wrapper.setState({ tos: true });

    wrapper.find("form").simulate("submit", { preventDefault() {} });

    expect(wrapper.instance().form.companyName).toBeDefined();

    expect(createAccount).toHaveBeenCalledTimes(1);
  });
});
