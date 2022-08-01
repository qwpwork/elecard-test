<template>
  <v-container class="mt-15 mb-10">

    <nav class="view-toggler ml-3 mb-5">
      <v-row class="mt-2">
        <v-radio-group 
          row
          mandatory
        >
          <v-radio
            label="Cards view"
            @click="isCardsRendering = true"
          />
          <v-radio
            label="Tree view"
            value="radio-2"
            @click="isCardsRendering = false"
          />
        </v-radio-group>
      </v-row>
    </nav>

    <div class="spinner text-center">
      <v-progress-circular
        v-if="isLoading == true"
        indeterminate
        color="primary"
      />
    </div>

    <section class="cards"
      v-show="isCardsRendering === true"
    >

      <v-row class="cards__menu">
        <v-btn
          class="ml-3 mb-2"
          depressed
          color="primary"
          @click="clearStorage()"
        >
          Clear localStorage
        </v-btn>
        <v-btn
          class="ml-3 mb-2"
          depressed
          color="primary"
          @click="sortCards('name', 'asc')"
        >
          Sort by category (Asc)
        </v-btn>
        <v-btn
          class="ml-3 mb-2"
          depressed
          color="primary"
          @click="sortCards('name', 'desc')"
        >
          Sort by category (desc)
        </v-btn>
        <v-btn
          class="ml-3 mb-2"
          depressed
          color="primary"
          @click="sortCards('timestamp', 'asc')"
        >
          Sort by date (Asc)
        </v-btn>
        <v-btn
          class="ml-3 mb-2"
          depressed
          color="primary"
          @click="sortCards('timestamp', 'desc')"
        >
          Sort by date (desc)
        </v-btn>
      </v-row>

      <v-row class="cards__block mb-15">
        <v-col 
          v-for="item in catalogInfo"
          :key="item.id"
          xs="12" sm="6" md="4" lg="3" xl="2"
        >
          <v-card class="card"
            elevation="5"
            v-if="parseInt(blackList[item.id]) != item.id"
          >
            <v-img class="card__img" :src="item.cardImage"/>
            <v-card-subtitle class="card__subtitle">
              <p>{{item.name}}</p>
              <p>{{getDate(item.timestamp)}}</p>
            </v-card-subtitle>
            <v-btn class="deleteBtn mt-0 ma-2"
              outlined
              color="indigo"
              @click="deleteBtnClicked($event.target, item.id)" 
            >
              Delete
            </v-btn>
          </v-card>
        </v-col>
      </v-row>

    </section>

    <section class="treeview"
      v-show="isCardsRendering === false"  
    >
      <v-row>
        <v-col md="3">
          <v-treeview class="tree"
            hoverable
            open-on-click
            :items="catalogInfo"
          >
            <template v-slot:prepend="{ item }">
              <div 
                class="pa-2"
                @click="treeChangeActiveImg(item.name, item.image)"
              >
                <v-img
                  class="pa-2 tree__thumbnail"
                  :src="item.preview" alt="thumbnail"
                />
              </div>
            </template>
            <template v-slot:label="{ item }">
              <p 
                class="pt-2 pb-2 mb-0"
                @click="treeChangeActiveImg(item.name, item.image)"
              >
                {{ item.name }}
              </p>
            </template>
          </v-treeview>
        </v-col>
        <v-col md="9">
          <p text="body-2"> {{ chosenRowTitle }} </p>
          <v-img class="tree__image_active" :src="chosenRowImg"></v-img>
        </v-col>
      </v-row>
    </section>
    
  </v-container>
</template>

<script>
  import _ from 'lodash';
  import axios from 'axios'
  import moment from 'moment'

  import { initCardDelete, loadDataFromStorage } from '../utils/delete.js'

  export default {

    data: () => ({
      isLoading: true, //bool 
      isCardsRendering: true, //bool
      blackList: [], //array
      catalogInfo: [], //array with object inside
      chosenRowImg: '',
      chosenRowTitle: ''
    }),

    created() {
      this.blackList = loadDataFromStorage();
      this.pageLoaging();
    },

    mounted() {
      this.pageLoaging();
    },
    
    methods: {
      
      /*
        * Sets new img and text on treeview tab
        *
        * @param {Stirng} newTitle
        * @param {Stirng} newImg. Contains path to img
      */
      treeChangeActiveImg(newTitle, newImg) {
        this.chosenRowImg = newImg;
        this.chosenRowTitle = newTitle;
      },

      async pageLoaging() {
        await axios.get('catalog.json').then(response => {
          this.catalogInfo = response.data;
        });
        this.isLoading = false
      },

      deleteBtnClicked(e, itemId) {
        /*
          * func is located in '../utils/delete.js'
        */
        initCardDelete(e, itemId);
      },

      clearStorage() {
        localStorage.clear();
      },

      /*
        * Getting a readable dateformat by moment.js
        *
        * @param {Stirng} date. Expects timestamp from .json file
        * @returns {date}
      */
      getDate(date) {
        return moment(date).format('MMMM Do YYYY, h:mm:ss a');
      },

      /*
        * Sorting catalogInfo by params
        *
        * @param {Stirng} filter. Expects a key of Obj from catalogInfo (usually 'name' or 'timestamp')
        * @param {Stirng} param. 'asc' is sorting by asc. 'desc' is sorting by desc
        * @returns {date}
      */
      sortCards(filter, param) {
        this.catalogInfo = _.orderBy(this.catalogInfo, [filter, 'id'], [param, param])
      }

    }
  }

</script>

<style lang="scss" scoped>
.card {
  width: 250px;
}

.tree {
  &__thumbnail {
    max-width: 32px;
  }
  &__image {
    &_active {
      max-height: 700px;
      max-width: 700px;
    }
  }
}
</style>