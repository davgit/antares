<template>
   <details class="accordion workspace-explorebar-database">
      <summary
         class="accordion-header database-name pb-0"
         :class="{'text-bold': breadcrumbs.schema === database.name}"
         @click="changeBreadcrumbs({schema: database.name, table:null})"
      >
         <i class="icon mdi mdi-18px mdi-chevron-right" />
         <i class="database-icon mdi mdi-18px mdi-database mr-1" />
         <span>{{ database.name }}</span>
      </summary>
      <div class="accordion-body">
         <div class="database-tables">
            <ul class="menu menu-nav pt-0">
               <li
                  v-for="table of database.tables"
                  :key="table.TABLE_NAME"
                  class="menu-item"
                  :class="{'text-bold': breadcrumbs.schema === database.name && breadcrumbs.table === table.TABLE_NAME}"
                  @click="changeBreadcrumbs({schema: database.name, table: table.TABLE_NAME})"
               >
                  <a class="table-name">
                     <i class="table-icon mdi mdi-18px mdi-table mr-1" />
                     <span>{{ table.TABLE_NAME }}</span>
                  </a>
               </li>
            </ul>
         </div>
      </div>
   </details>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
   name: 'WorkspaceExploreBarDatabase',
   props: {
      database: Object,
      connection: Object
   },
   computed: {
      ...mapGetters({
         getWorkspace: 'workspaces/getWorkspace'
      }),
      breadcrumbs () {
         return this.getWorkspace(this.connection.uid).breadcrumbs;
      }
   },
   methods: {
      ...mapActions({
         changeBreadcrumbs: 'workspaces/changeBreadcrumbs'
      })
   }
};
</script>

<style lang="scss">
  .workspace-explorebar-database {
    .database-name,
    a.table-name {
      display: flex;
      align-items: center;
      padding: 0.1rem;
      cursor: pointer;
      font-size: 0.7rem;

      > span {
        overflow: hidden;
        white-space: nowrap;
        display: block;
        text-overflow: ellipsis;
      }

      &:hover {
        color: $body-font-color;
        background: rgba($color: #fff, $alpha: 0.05);
        border-radius: 2px;
      }

      .database-icon,
      .table-icon {
        opacity: 0.7;
      }
    }

    .menu-item {
      line-height: 1.2;
    }

    .database-tables {
      margin-left: 1.2rem;
    }
  }
</style>
