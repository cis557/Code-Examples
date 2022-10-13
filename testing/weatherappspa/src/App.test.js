import React from 'react';
// import testing library functions
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import {within} from '@testing-library/dom'
import WeatherApp from './App';

// const renderer = require('react-test-renderer');

test('renders Boston link', () => {
  const { getByText } = render(<WeatherApp />);
  const linkElement = getByText(/Boston/);
  expect(linkElement).toBeInTheDocument();
});

// snapshot testing

test('Weather app matches snapshot', () => {
  const component = renderer.create(<WeatherApp />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

// test type event
test('When user enters a city it is displayed', async () => {
  render(<WeatherApp />);
  // create a reference to the textbox
  const element = screen.getByRole('textbox')

  // type some text (douala) into the textbox
  await userEvent.type(element,  'douala');
  // fire a click on the Ok button
  // await user.click(screen.getByRole('button', {name: /OK/i}))
  // assertion: verify that the text is in the textbox
  expect(element).toHaveValue('douala')
});

// test click event

test('Textbox empty after clicking on a link', async () => {
  // render the component
  render(<WeatherApp />);
  // create a reference to the textbox
  const element = screen.getByRole('textbox')

  // type some text (douala) into the textbox
  await userEvent.type(element,  'douala');

  // assertion: verify that the text is in the textbox
  expect(element).toHaveValue('douala')
  // fire a click on the a link (city) button
  await userEvent.click(screen.getByText('Mumbai'));

  // assertion: verify that the textbox is empty
  expect(element).toHaveValue('')
  
});

