import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
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
