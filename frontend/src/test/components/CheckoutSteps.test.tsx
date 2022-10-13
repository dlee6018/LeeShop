import React from "react";
import CheckoutSteps from "../../components/CheckoutSteps";
import {shallow} from "enzyme"


it("renders CheckoutSteps component", () => {
    const component = shallow(<CheckoutSteps/>)
    expect(component).toMatchSnapshot()
})