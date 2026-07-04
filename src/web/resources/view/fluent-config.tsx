const form = L.form;
const uci = L.uci;

import { registerAdvancedTab } from "./fluent-config/tabs/advanced";
import { registerAnimationTab } from "./fluent-config/tabs/animation";
import { registerColorsTab } from "./fluent-config/tabs/colors";
import { registerGeneralTab } from "./fluent-config/tabs/general";
import { registerLoginTab } from "./fluent-config/tabs/login";
import { registerAboutTab } from "./fluent-config/tabs/about";

class mainImpl extends L.view {
  load() {
    return uci.load("fluent");
  }

  render(data: unknown) {
    void data;

    const MapCtor = (form as unknown as { Map: new (config: string, title?: string, description?: string) => LuCI.form.MapElement }).Map;
    const map = new MapCtor(
      "fluent",
      _("Fluent theme settings"),
      _("Configure color mode, accent colors, layout sizing, animation behavior, login-page appearance, and advanced CSS overrides for luci-theme-fluent."),
    );

    const section = map.section(form.TypedSection, "global", _("Theme settings"));
    section.addremove = false;
    section.anonymous = true;

    registerGeneralTab(section);
    registerColorsTab(section);
    registerAnimationTab(section);
    registerLoginTab(section);
    registerAdvancedTab(section);
    registerAboutTab(section);

    return (map as unknown as { render: () => Promise<Node> }).render();
  }
}

export const main = mainImpl;
