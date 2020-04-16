import {
  reconcileChildren,
  createElement,
  createDom,
  commitDeletion,
  updateDom
} from "./utils";

let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null;
let wipFiber = null;
let hookIndex = 0;

const createRoot = container => {
  return {
    render(element) {
      wipRoot = {
        dom: container,
        props: {
          children: [element]
        },
        alternate: currentRoot
      };
      nextUnitOfWork = wipRoot;
    }
  };
};

const workLoop = deadline => {
  let shouldYield = false;
  let suspendedWork = null;

  while (nextUnitOfWork && !shouldYield) {
    try {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    } catch (error) {
      if (error instanceof Promise) {
        suspendedWork = nextUnitOfWork;
        nextUnitOfWork = null;
        error.then(() => {
          nextUnitOfWork = suspendedWork;
          wipRoot = currentRoot;
        });
      } else {
        throw error;
      }
    }
    shouldYield = deadline.timeRemaining() < 1;
  }

  while (!nextUnitOfWork && wipRoot) {
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;
  }

  requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);

const performUnitOfWork = fiber => {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    wipFiber = fiber;
    hookIndex = 0;
    wipFiber.hooks = [];
    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children.flat());
  } else {
    if (!fiber.dom) fiber.dom = createDom(fiber);
    reconcileChildren(fiber, fiber.props.children.flat());
  }

  if (fiber.child) return fiber.child;
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
};

const commitWork = fiber => {
  if (!fiber) return;

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

function useState(initial) {
  const oldHook = wipFiber?.alternate?.hooks[hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initial,
    pendingState: "__NONE__"
  };
  if (oldHook && oldHook.pendingState !== "__NONE__") {
    hook.state = oldHook.pendingState;
  }

  const setState = newState => {
    hook.pendingState = newState;
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    };

    nextUnitOfWork = wipRoot;
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

export const React = { useState, createRoot, createElement };
