import { mount } from '@vue/test-utils'
/**
 * Executes the setup function and returns a wrapper object.
 * @template V The type of the setup function return value.
 * @param {() => V} setup The setup function to be executed.
 * @throws {Error} Throws an error if there is an issue with mounting the component.
 * @returns {{ wrapper: Wrapper }} Returns an object containing the mounted wrapper.
 */
export function useSetup<V>(setup: () => V) {
  const comp = {
    setup,
    render() {},
  }

  const wrapper = mount(comp)
  return {
    wrapper,
  }
}
