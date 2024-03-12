import { createVNode, render, type ComponentPublicInstance } from "vue";
import MessageBoxConstructor from "./MessageBox.vue";
import type { IMessageBoxProps } from "~/composables/messageBox/modal";

interface MessageBoxOptions {
  /** Text content of confirm button */
  confirmBtnText: string;
  /** Text content of cancel button */
  cancelBtnText: string;
  /** Custom element to append the message box to */
  appendTo?: HTMLElement | string;
}

type Action = "confirm" | "cancel";

interface MessageBoxProps extends IMessageBoxProps {
  container: HTMLElement;
}

const messageInstance = new Map<
  ComponentPublicInstance<MessageBoxProps>,
  {
    options: any;
    reject: (res: any) => void;
    resolve: (reson?: any) => void;
  }
>();

/**
 * Generates a new container element.
 * @returns {HTMLElement} - The newly created container element.
 * @throws {Error} - If the 'createElement' function is not available in the document object.
 */
const genContainer = () => {
  return document.createElement("div");
};

/**
 * Retrieves the element to which the content will be appended.
 * 
 * @param props - The properties object containing the information about the element to append to.
 * @returns The HTMLElement to which the content will be appended.
 * @throws {Error} If the provided props are invalid or if the element to append to is not found.
 */
const getAppendToElement = (props: any): HTMLElement => {
  let appendTo: HTMLElement | null = document.body;
  if (props.appendTo) {
    if (typeof props.appendTo === "string") {
      appendTo = document.querySelector<HTMLElement>(props.appendTo);
    }
    if (props.appendTo instanceof Element) {
      appendTo = props.appendTo;
    }
    if (!(appendTo instanceof Element)) {
      appendTo = document.body;
    }
  }
  return appendTo;
};

/**
 * Teardown the message box component.
 * @param vm The component instance of the message box.
 * @param container The HTML element container.
 * @throws {Error} If the rendering fails.
 */
const teardown = (
  vm: ComponentPublicInstance<MessageBoxProps>,
  container: HTMLElement
) => {
  render(null, container);
  messageInstance.delete(vm);
};

/**
 * Initialize a new instance with the given properties and container element.
 * @param props - The properties for the instance.
 * @param container - The container element to render the instance into.
 * @throws {Error} Throws an error if any of the called functions are not available.
 */
const initInstance = (props: any, container: HTMLElement) => {
  const vnode = createVNode(MessageBoxConstructor, props);
  render(vnode, container);
  getAppendToElement(props).appendChild(container.firstElementChild!);
  return vnode.component;
};

/**
 * Show message with the given options.
 * 
 * @param options - The options for the message.
 * @returns The component instance for the message.
 * @throws {Error} When an error occurs during message display.
 */
const showMessage = (options: any) => {
  const container = genContainer();

  options.onConfirm = () => {
    const currentMsg = messageInstance.get(vm)!;
    currentMsg.resolve("confirm");

    teardown(vm, container);
  };

  options.onCancel = () => {
    const currentMsg = messageInstance.get(vm)!;
    currentMsg.reject("cancel");

    teardown(vm, container);
  };

  const instance = initInstance(options, container)!;

  const vm = instance.proxy as ComponentPublicInstance<MessageBoxProps>;

  vm.container = container;

  for (const prop in options) {
    if (Object.hasOwn(options, prop) && !Object.hasOwn(vm.$props, prop)) {
      vm[prop as keyof ComponentPublicInstance] = options[prop];
    }
  }

  return vm;
};

/**
 * Displays a message box with the specified content and title, and returns a promise that resolves with the user's action.
 * @param content The content of the message box. Defaults to "Are you sure?" if not provided.
 * @param title The title of the message box. Defaults to "Tips" if not provided.
 * @param options Additional options for customizing the message box.
 * @returns A promise that resolves with the user's action.
 * @throws {Error} If there is an issue displaying the message box.
 */
function MessageBox(
  content: string = "Are you sure?",
  title: string = "Tips",
  options?: MessageBoxOptions
): Promise<Action> {
  return new Promise((resolve, reject) => {
    const vm = showMessage(
      Object.assign(
        {
          content,
          title,
          isShowModal: true,
          confirmBtnText: "Confirm",
          cancelBtnText: "Cancel",
        },
        options
      )
    );
    messageInstance.set(vm, {
      options,
      resolve,
      reject,
    });
  });
}

MessageBox.close = () => {
  messageInstance.forEach((_, vm) => {
    teardown(vm, vm.container);
  });
};

export default MessageBox;
