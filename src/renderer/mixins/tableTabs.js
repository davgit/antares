import Tables from '@/ipc-api/Tables';

export default {
   computed: {
      schema () {
         if (Array.isArray(this.results)) {
            const resultsWithRows = this.results.filter(result => result.rows);

            if (resultsWithRows[this.selectedResultsset] && resultsWithRows[this.selectedResultsset].fields.length)
               return resultsWithRows[this.selectedResultsset].fields[0].db;
         }
         return this.workspace.breadcrumbs.schema;
      }
   },
   methods: {
      async updateField (payload) {
         this.isQuering = true;

         const params = {
            uid: this.connection.uid,
            schema: this.schema,
            ...payload
         };

         try {
            const { status, response } = await Tables.updateTableCell(params);
            if (status === 'success') {
               if (response.reload)// Needed for blob fields
                  this.reloadTable();
               else
                  this.$refs.queryTable.applyUpdate(payload);
            }
            else
               this.addNotification({ status: 'error', message: response });
         }
         catch (err) {
            this.addNotification({ status: 'error', message: err.stack });
         }

         this.isQuering = false;
      },
      async deleteSelected (payload) {
         this.isQuering = true;

         const params = {
            uid: this.connection.uid,
            schema: this.schema,
            ...payload
         };

         try {
            const { status, response } = await Tables.deleteTableRows(params);

            if (status === 'success') {
               const { primary, rows } = params;

               if (Array.isArray(this.results)) {
                  this.results = this.results.map((result, index) => {
                     if (index === this.selectedResultsset) {
                        return {
                           ...result,
                           rows: result.rows.filter(row => !rows.includes(row[primary]))
                        };
                     }
                     else
                        return result;
                  });
               }
               else
                  this.results = { ...this.results, rows: this.results.rows.filter(row => !rows.includes(row[primary])) };

               this.$refs.queryTable.refreshScroller();// Necessary to re-render virtual scroller
            }
            else
               this.addNotification({ status: 'error', message: response });
         }
         catch (err) {
            this.addNotification({ status: 'error', message: err.stack });
         }

         this.isQuering = false;
      }
   }
};
