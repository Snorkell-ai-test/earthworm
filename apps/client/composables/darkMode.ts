import { ref } from "vue";

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

const DARK_MODE = "DARK_MODE";

const darkMode = ref(Theme.LIGHT);
/**
 * Function to enable dark mode on the website.
 * @returns {{
 *    setDarkMode: (state?: boolean) => void,
 *    toggleDarkMode: (event: MouseEvent) => void,
 *    initDarkMode: () => void,
 *    darkMode: Theme
 * }}
 */
export function useDarkMode() {
  const isAppearanceTransition =
    // @ts-expect-error: Transition API
    document.startViewTransition &&
    !window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;

  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const cacheDarkMode = sessionStorage.getItem(DARK_MODE) as Theme | null;

  /**
   * Initializes the dark mode based on the current state and cache.
   * @throws {Error} Throws an error if the dark mode cannot be set.
   */
  const initDarkMode = () => {
    if (isDarkMode && !cacheDarkMode) {
      setDarkMode(true);
      return;
    }
    setDarkMode(cacheDarkMode === Theme.DARK);
  };

  /**
   * Toggles the dark mode by adding or removing the "dark" class from the document element.
   * @param isDark - A boolean indicating whether to enable or disable dark mode.
   * @throws - No exceptions are thrown by this method.
   */
  const toggle = (isDark: boolean) => {
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  /**
   * Toggles the dark mode based on the event.
   * 
   * @param event - The mouse event triggering the dark mode toggle.
   * 
   * @throws {Error} - Throws an error if there is an issue with the transition API.
   */
  const toggleDarkMode = (event: MouseEvent) => {
    const isDark = document.documentElement.classList.contains("dark");

    if (!isAppearanceTransition) {
      setDarkMode(!isDark);
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    // @ts-expect-error: Transition API
    const transition = document.startViewTransition(() => {
      setDarkMode(!isDark);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: isDark ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 300,
          easing: "ease-in",
          pseudoElement: isDark
            ? "::view-transition-new(root)"
            : "::view-transition-old(root)",
        }
      );
    });
  };

  /**
   * Sets the dark mode for the application.
   * 
   * @param state - A boolean indicating whether to enable or disable dark mode.
   * @throws {Error} - If state is not a boolean value.
   */
  const setDarkMode = (state = false) => {
    if (state) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      darkMode.value = Theme.DARK;
      sessionStorage.setItem(DARK_MODE, Theme.DARK);
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      darkMode.value = Theme.LIGHT;
      sessionStorage.setItem(DARK_MODE, Theme.LIGHT);
    }
  };

  return {
    setDarkMode,
    toggleDarkMode,
    initDarkMode,
    darkMode,
  };
}
