import {shallow} from "enzyme"
import React from 'react'
import Footer from '../../components/Footer'

it('render a footer component', () => {
    expect(shallow(<Footer/>)).toMatchSnapshot()
});
