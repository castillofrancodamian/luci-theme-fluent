const form = L.form;

import { configureHexColorValue } from "../shared";

export const registerColorsTab = (section: LuCI.form.TypedSection): void => {
  section.tab(
    "colors",
    _("Colors"),
    _("Set separate accent, progress-bar text, and background colors for light and dark mode."),
  );

  // --- Accent Colors ---
  {
    const option = section.taboption(
      "colors",
      form.Value,
      "primary",
      _("Light mode accent color"),
      _("HEX color used as the primary Fluent accent when the interface is rendered in light mode."),
    );
    option.default = "#0078d4";
    configureHexColorValue(option, "primary");
  }

  {
    const option = section.taboption(
      "colors",
      form.Value,
      "dark_primary",
      _("Dark mode accent color"),
      _("HEX color used as the primary Fluent accent when the interface is rendered in dark mode."),
    );
    option.default = "#4da6ff";
    configureHexColorValue(option, "dark_primary", true);
  }

  // --- Progress Bar Text Colors ---
  {
    const option = section.taboption(
      "colors",
      form.Value,
      "progressbar_font",
      _("Light mode progress bar text color"),
      _("HEX color used for progress-bar labels while the interface is rendered in light mode."),
    );
    option.default = "#2e2b60";
    configureHexColorValue(option, "progressbar_font");
  }

  {
    const option = section.taboption(
      "colors",
      form.Value,
      "dark_progressbar_font",
      _("Dark mode progress bar text color"),
      _("HEX color used for progress-bar labels while the interface is rendered in dark mode."),
    );
    option.default = "#d6d9e5";
    configureHexColorValue(option, "dark_progressbar_font", true);
  }

  // --- Light Mode Background Colors ---
  {
    const option = section.taboption(
      "colors",
      form.Value,
      "page_bg",
      _("Light mode page background"),
      _("HEX color used for the main page background in light mode."),
    );
    option.default = "#fafafa";
    configureHexColorValue(option, "page_bg");
  }

  {
    const option = section.taboption(
      "colors",
      form.Value,
      "card_bg",
      _("Light mode card background"),
      _("HEX color used for container/card elements in light mode."),
    );
    option.default = "#ffffff";
    configureHexColorValue(option, "card_bg");
  }

  {
    const option = section.taboption(
      "colors",
      form.Value,
      "sidebar_bg",
      _("Light mode sidebar background"),
      _("HEX color used for the navigation sidebar in light mode."),
    );
    option.default = "#ffffff";
    configureHexColorValue(option, "sidebar_bg");
  }

  // --- Dark Mode Background Colors ---
  {
    const option = section.taboption(
      "colors",
      form.Value,
      "dark_page_bg",
      _("Dark mode page background"),
      _("HEX color used for the main page background in dark mode."),
    );
    option.default = "#1b1b1b";
    configureHexColorValue(option, "dark_page_bg", true);
  }

  {
    const option = section.taboption(
      "colors",
      form.Value,
      "dark_card_bg",
      _("Dark mode card background"),
      _("HEX color used for container/card elements in dark mode."),
    );
    option.default = "#2d2d2d";
    configureHexColorValue(option, "dark_card_bg", true);
  }

  {
    const option = section.taboption(
      "colors",
      form.Value,
      "dark_sidebar_bg",
      _("Dark mode sidebar background"),
      _("HEX color used for the navigation sidebar in dark mode."),
    );
    option.default = "#1f1f1f";
    configureHexColorValue(option, "dark_sidebar_bg", true);
  }
};
