const form = L.form;

import { configureHexColorValue, createModeSubtabs } from "../shared";

export const registerColorsTab = (section: LuCI.form.TypedSection): void => {
  section.tab(
    "colors",
    _("Colors"),
    _("Set separate accent, progress-bar text, and background colors for light and dark mode."),
  );

  const modeSection = createModeSubtabs(section, "colors", "colors_mode_tabs");

  // --- Light Mode Colors ---
  {
    const option = modeSection.taboption(
      "light",
      form.Value,
      "primary",
      _("Accent color"),
      _("HEX color used as the primary Fluent accent when the interface is rendered in light mode."),
    );
    option.default = "#0078d4";
    configureHexColorValue(option, "primary");
  }

  {
    const option = modeSection.taboption(
      "light",
      form.Value,
      "progressbar_font",
      _("Progress bar text color"),
      _("HEX color used for progress-bar labels while the interface is rendered in light mode."),
    );
    option.default = "#2e2b60";
    configureHexColorValue(option, "progressbar_font");
  }

  {
    const option = modeSection.taboption(
      "light",
      form.Value,
      "page_bg",
      _("Page background"),
      _("HEX color used for the main page background in light mode."),
    );
    option.default = "#fafafa";
    configureHexColorValue(option, "page_bg");
  }

  {
    const option = modeSection.taboption(
      "light",
      form.Value,
      "card_bg",
      _("Card background"),
      _("HEX color used for container/card elements in light mode."),
    );
    option.default = "#ffffff";
    configureHexColorValue(option, "card_bg");
  }

  {
    const option = modeSection.taboption(
      "light",
      form.Value,
      "sidebar_bg",
      _("Sidebar background"),
      _("HEX color used for the navigation sidebar in light mode."),
    );
    option.default = "#f3f3f3";
    configureHexColorValue(option, "sidebar_bg");
  }

  // --- Dark Mode Colors ---
  {
    const option = modeSection.taboption(
      "dark",
      form.Value,
      "dark_primary",
      _("Accent color"),
      _("HEX color used as the primary Fluent accent when the interface is rendered in dark mode."),
    );
    option.default = "#4da6ff";
    configureHexColorValue(option, "dark_primary", true);
  }

  {
    const option = modeSection.taboption(
      "dark",
      form.Value,
      "dark_progressbar_font",
      _("Progress bar text color"),
      _("HEX color used for progress-bar labels while the interface is rendered in dark mode."),
    );
    option.default = "#d6d9e5";
    configureHexColorValue(option, "dark_progressbar_font", true);
  }

  {
    const option = modeSection.taboption(
      "dark",
      form.Value,
      "dark_page_bg",
      _("Page background"),
      _("HEX color used for the main page background in dark mode."),
    );
    option.default = "#1b1b1b";
    configureHexColorValue(option, "dark_page_bg", true);
  }

  {
    const option = modeSection.taboption(
      "dark",
      form.Value,
      "dark_card_bg",
      _("Card background"),
      _("HEX color used for container/card elements in dark mode."),
    );
    option.default = "#2d2d2d";
    configureHexColorValue(option, "dark_card_bg", true);
  }

  {
    const option = modeSection.taboption(
      "dark",
      form.Value,
      "dark_sidebar_bg",
      _("Sidebar background"),
      _("HEX color used for the navigation sidebar in dark mode."),
    );
    option.default = "#1f1f1f";
    configureHexColorValue(option, "dark_sidebar_bg", true);
  }
};
