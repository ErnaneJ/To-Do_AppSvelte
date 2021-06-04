import {fireEvent, render} from '@testing-library/svelte';

import AddTask from './components/AddTask.svelte';

describe('AddTask', () => {
  test('message and input have alwayys same values', async () => {
    const {container, getByText} = render(AddTask);
    const input = container.querySelector('input');
    const button = container.querySelector('#add');

    // initial state
    expect(input.value).toBe('');
    // type in input
    await fireEvent.input(input, {target: {value: 'testanso 1,2,3...'}});
    expect(input.value).toBe('testanso 1,2,3...');
    // click button
    await fireEvent.click(button);
    expect(input.value).toBe('');
  });
});