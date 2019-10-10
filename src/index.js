import Launcher from './Launcher.vue'
import VTooltip from 'v-tooltip'
//import Chat from './Chat.vue'

const defaultComponentName = 'beautiful-chat'

const Plugin = {
  install (Vue, options = {}) {
    /**
     * Makes sure that plugin can be installed only once
     */
    if (this.installed) {
      return
    }

    this.installed = true
    this.event = new Vue()
    this.dynamicContainer = null
    this.componentName = options.componentName || defaultComponentName
    /**
     * Plugin API
     */
    Vue.prototype.$chat = {
      _setDynamicContainer (dynamicContainer) {
        Plugin.dynamicContainer = dynamicContainer
      }
    }
    /**
     * Sets custom component name (if provided)
     */
    Vue.component(this.componentName, Launcher)
    
    Vue.use(VTooltip)
    //Vue.component('goddaw', Chat)
  }
}

export default Plugin
