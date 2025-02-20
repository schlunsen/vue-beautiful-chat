<template>
  <div>
    <transition name="fade">
      <Launcher
        v-if="showChat"
        :participants="participants"
        :titleImageUrl="titleImageUrl"
        :onMessageWasSent="onMessageWasSent"
        :messageList="messageList"
        :newMessagesCount="newMessagesCount"
        :isOpen="isChatOpen"
        :close="closeChat"
        :icons="icons"
        :open="openChat"
        :showEmoji="true"
        :showFile="true"
        :showTypingIndicator="showTypingIndicator"
        :colors="colors"
        :alwaysScrollToBottom="alwaysScrollToBottom"
        :messageStyling="messageStyling"
        @onType="handleOnType"
        @edit="editMessage"
      >
        <template v-slot:header>{{participants.map(m=>m.name).join(' & ')}}</template>
      </Launcher>
    </transition>
  </div>
</template>


<script>
import { WSController } from "./WSController.js";
import Launcher from './Launcher.vue'
import CloseIcon from "./assets/close-icon.png";
import OpenIcon from "./assets/logo-no-bg.svg";
import FileIcon from "./assets/file.svg";
import CloseIconSvg from "./assets/close.svg";

export default {
  name: "chat",
  props: ["initialRoomGroupName", "domain"],
  async mounted() {
    let domain = "ws://localhost:8000";
    this.wsController = new WSController(this.domain, null, this);
    await this.wsController.isConnected();
    this.showChat = true;
    // Regoster event listener for chat recieved
    this.$on("chat_received", msg => {
      if (msg && msg.message && msg.message.message) {
        if (msg.message.roomGroupName === this.roomGroupName) {
          this.messageList = [...this.messageList, msg.message.message];
        }
      }
    });
    this.wsController.joinRoom(this.roomGroupName);
  },
  beforeDestroy() {
    this.$off("chat_received");
  },
  destroyed() {
    this.messageList = [];
  },
  data: function() {
    return {
      roomGroupName:
        this.initialRoomGroupName || window.localStorage.getItem("room_group_name"),
      showChat: true,
      icons: {
        open: {
          img: OpenIcon,
          name: "default"
        },
        close: {
          img: CloseIcon,
          name: "default"
        },
        file: {
          img: FileIcon,
          name: "default"
        },
        closeSvg: {
          img: CloseIconSvg,
          name: "default"
        }
      },
      participants: [
        {
          id: "user1",
          name: "Matteo",
          imageUrl: "https://avatars3.githubusercontent.com/u/1915989?s=230&v=4"
        },
        {
          id: "user2",
          name: "Support",
          imageUrl:
            "https://avatars3.githubusercontent.com/u/37018832?s=200&v=4"
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl:
        "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png",
      messageList: [
        // { type: "text", author: `me`, data: { text: `Say yes!` } },
        // { type: "text", author: `user1`, data: { text: `No.` } }
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: "", // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: "#4e8cff",
          text: "#ffffff"
        },
        launcher: {
          bg: "#4e8cff"
        },
        messageList: {
          bg: "#ffffff"
        },
        sentMessage: {
          bg: "#4e8cff",
          text: "#ffffff"
        },
        receivedMessage: {
          bg: "#eaeaea",
          text: "#222222"
        },
        userInput: {
          bg: "#f4f7f9",
          text: "#565867"
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    };
  },
  components: {
    Launcher
  },
  methods: {
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1;
        this.onMessageWasSent({
          author: "support",
          type: "text",
          data: { text }
        });
      }
    },
    onMessageWasSent(message) {
      this.wsController.sendMessage(
        JSON.stringify({
          command: "msg",
          message: message,
          roomGroupName: this.roomGroupName
        })
      );
      // called when the user sends a message
      //  this.messageList = [...this.messageList, message];
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false;
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType() {
      console.log("Emit typing event");
    },
    editMessage(message) {
      const m = this.messageList.find(m => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    }
  }
};
</script>

<style>
</style>