<template>
  <v-content>
    <v-container>
      <v-card
        :style="`margin-top: 60px;`"
        class="mx-auto"
        max-width="800"
        tile>
        <br/>
        <v-layout justify-center wrap>
          <v-spacer></v-spacer>
          <v-flex xs3>
            <v-text-field v-model="room" label="ROOM" dense></v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs3>
            <v-text-field v-model="name" label="USER" dense></v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs2>
            <v-btn @click="connect" :color="!connected?'primary':'error'">{{cbutton}}</v-btn>
          </v-flex>
          <v-spacer></v-spacer>
        </v-layout>
        <v-layout justify-center wrap :style="`margin: 20px 0;`">
          <v-list class="overflow-y-auto scroll-to" height="300" :style="`width: 90%`">
            <v-list-item v-for="(item, i) in items" :key="i" >
              <span v-html="item.msg" ></span>
            </v-list-item>
          </v-list>
        </v-layout>
        <hr/>
        <v-layout justify-center wrap>
          <v-flex xs10 :style="`margin-top: 20px;`">
            <v-text-field v-model="text" outlined dense
              @keyup.enter="commit_txt"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </v-content>
</template>

<script>

const url = 'ws://localhost:8000/ws/';
var ws = null;

export default {
  components: {
  },
  data: () => ({
    items: [],
    text: '',
    room:'test-room',
    name:'user-' + Math.random().toString(32).substring(5),
    connected: false,
  }),
  computed: {
    cbutton: function(){
      if(this.connected) {
        return 'Disconnect'
      } else {
        return 'Connect'
      }
    },
  },
  methods: {
    commit_txt : function () {
      var elem = this.$el
      elem.scrollTop = elem.clientHeight;
      if (this.text != '') { 
        ws.send(JSON.stringify({'message':this.text, 'name':this.name}));
      }
      //this.items.push({msg:this.text});
      this.text = '';
    },
    connect: function () {
      if(!this.connected) {
        ws = new WebSocket(url+this.room);
        ws.onopen = function(event) {
          console.log(">> onopen");
          console.log(event);
        };
        ws.onmessage = this.onmessage;
        ws.onerror = this.onerror;
        ws.onclose = this.onclose;
        this.connected=true;
      } else {
        ws.close();
        ws = null;
      }
    },
    onmessage: function (event) {
      console.log(">> onmessage");
      if (event && event.data) {
        let js = JSON.parse(event.data);
        this.items.push({msg:js.name +' : ' + js.message});
      }
    },
    onerror: function (event) {
      console.log(">> onerror");
      console.log(event);
      this.connected=false;
    },
    onclose: function (event) {
      console.log(">> onclose");
      console.log(event);
      this.connected=false;
    },
  },
  mounted: function (){
    console.log(1111)
  }
};
</script>