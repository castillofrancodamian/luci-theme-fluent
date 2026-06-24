const form = L.form;

import { createModeSubtabs, transparencySteps } from "../shared";

export const registerLoginTab = (section: LuCI.form.TypedSection): void => {
  section.tab(
    "login",
    _("Login page"),
    _("Adjust login card opacity and blur separately for light and dark mode."),
  );

  const modeSection = createModeSubtabs(section, "login", "login_mode_tabs");

  {
    const option = modeSection.taboption(
      "light",
      form.ListValue,
      "transparency",
      _("Login card opacity"),
      _("Opacity of the login card in light mode. 0 is fully transparent and 1 is fully opaque."),
    );
    for (const step of transparencySteps) option.value(String(step));
    option.default = "0.5";
    option.rmempty = false;
  }

  {
    const option = modeSection.taboption(
      "light",
      form.Value,
      "blur",
      _("Backdrop blur radius"),
      _("Blur radius in pixels behind the login card in light mode. Use 0 to disable blur."),
    );
    option.datatype = "ufloat";
    option.default = "0";
    option.rmempty = false;
  }

  {
    const option = modeSection.taboption(
      "dark",
      form.ListValue,
      "transparency_dark",
      _("Login card opacity"),
      _("Opacity of the login card in dark mode. 0 is fully transparent and 1 is fully opaque."),
    );
    for (const step of transparencySteps) option.value(String(step));
    option.default = "0.5";
    option.rmempty = false;
  }

  {
    const option = modeSection.taboption(
      "dark",
      form.Value,
      "blur_dark",
      _("Backdrop blur radius"),
      _("Blur radius in pixels behind the login card in dark mode. Use 0 to disable blur."),
    );
    option.datatype = "ufloat";
    option.default = "0";
    option.rmempty = false;
  }
};
