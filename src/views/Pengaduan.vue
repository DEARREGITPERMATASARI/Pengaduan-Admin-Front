<template>


  <div class="container-fluid page-body-wrapper">
    <section class="contact section-padding">
      <br />
      <br />
      <br />
      <div class="container mt-3">
        <div class="row">
          <div class="col-lg-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h2 class="card-title float-left">Data Pengaduan</h2>
              <div>
                              <vue-html2pdf
                                :show-layout="false"
                                :float-layout="true"
                                :enable-download="false"
                                :preview-modal="true"
                                :paginate-elements-by-height="2400"
                                filename="ReportPengaduanMasyarakat"
                                :pdf-quality="2"
                                  pdf-format="a3"
                                  pdf-orientation="portrait"
                                  pdf-content-width="800px"
                                :manual-pagination="false"

                      @hasStartedGeneration="hasStartedGeneration()"
                      @hasGenerated="hasGenerated($event)"
                      ref="html2Pdf" >

                      <section slot="pdf-content">
                          <div class="invoice-box">
                      <table>
                        <tr class="top">
                          <td colspan="2">
                            <table>
                              <tr>
                              
                              <td>
                                Dengan: {{reports.nama}} <br />
                                Tanggal: <span v-if="reportt.tgl_tanggapan">{{reportt.tgl_tanggapan}}</span> <span v-else>-</span> <br />
                                Kategori: {{reportk.nama_kategori}} <br />
                                Status: {{reportp.status}}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
  
                      <tr class="heading">
                        <td>Data User</td>
                        <td> #</td>
                      </tr>

                       <tr class="details">
                        <td>NIK</td>
                        <td> {{reports.nik}} </td>
                      </tr>

                      <tr class="details" :items="user">
                        <td>Nama Lengkap</td>
                        <td> {{reports.nama}} </td>
                      </tr>

                      <tr class="details" :items="user">
                        <td>Username</td>
                        <td> {{reports.username}} </td>
                      </tr>

                       <tr class="details" :items="user">
                        <td>Telepon</td>
                        <td> {{reports.telp}} </td>
                      </tr>

                      <tr class="heading">
                        <td>Data Pengaduan</td>

                        <td> #</td>
                      </tr>

                      <tr class="item">
                        <td>Tanggal Pengaduan</td>
                        <td> {{reportp.tgl_pengaduan}} </td>
                      </tr>

                      <tr class="item">
                        <td>Laporan</td>
                        <td> {{reportp.isi_laporan}} </td>
                      </tr>

                      <tr class="item">
                        <td>Status</td>
                        <td> <span v-if="reportp.status"> {{reportp.status}} </span> <span v-else>-</span></td>
                      </tr>
                       <tr class="item last">
                        <td>Bukti</td>
                        <td> <img v-if="reportp.foto" 
                              style="width: 50px;
                              height: 50px;
                              border-radius: 10%;" 
                              :src="'http://localhost:8000/uploads/' + reportp.foto">  
                        </td>
                      </tr>

                    </table>
                  </div>
                      </section>
                  </vue-html2pdf>
                  
                </div>

                <div class="table-responsive">
                  <b-table striped hover :items="pengaduan" :fields="fields">
                    <template v-slot:cell(foto)="data">
                      <img style="width:200px; height: 150px; border-radius:5%" :src="'http://localhost:8000/uploads/' + data.item.foto" />
                    </template>
                    <template v-slot:cell(tanggapan)="data">
                      {{ (data.item.tanggapan !== null) ? data.item.tanggapan.tanggapan :null }}
                    </template>
                    <template v-slot:cell(status)="data">
                     <b-badge variant="info" v-if="data.item.status === 'terkirim'">{{ data.item.status }}</b-badge>
                      <b-badge variant="warning" v-if="data.item.status === 'proses'">{{ data.item.status }}</b-badge>
                      <b-badge variant="success" v-if="data.item.status === 'selesai'">{{ data.item.status }}</b-badge>
                      <b-badge variant="danger" v-if="data.item.status === 'tolak'">{{ data.item.status }}</b-badge>
                  </template>
                      <template v-slot:cell(kategori)="data">
                      {{ (data.item.kategori !== null) ? data.item.kategori.nama_kategori :null }}
                    </template>
                   
                  
                    <template v-slot:cell(Aksi)="data">
                      <b-button variant="secondary" v-on:click="AddTanggapan(data.item)" v-b-modal.modalTanggapan>
                        <i class="mdi mdi-plus btn-icon-prepend" ></i>Tanggapan</b-button>&nbsp;
                      <b-button variant="info" v-on:click="ChangeStatus (data.item)" v-b-modal.modalStatus><i class="mdi mdi-pencil btn-icon-prepend"></i>Ubah Status</b-button>
                      <br /><b-button variant="danger"  v-on:click="generateReport(data.item.id_pengaduan)">
                        <i class="mdi mdi-note btn-icon-prepend"></i> 
                            Report</b-button>
                    </template>
                  </b-table>
                  
                  <b-pagination
                    v-model="currentPage"
                    :per-page="perPage"
                    :total-rows="rows"
                    align="center"
                    v-on:input="pagination">
                  </b-pagination>

                  <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                    <b-spinner label="Spinning" variant="success"></b-spinner>
                    <strong class="text-success">Loading...</strong>
                  </b-toast>

                  <!-- toast untuk tampilan message box -->
                  <b-toast id="message" title="Message">
                    <strong class="text-success">{{ message }}</strong>
                  </b-toast>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <b-modal 
      id="modalTanggapan"
      @ok="Tanggapan"
    >
      <template v-slot:modal-title>
        Masukkan Tanggapan Anda Disini
      </template>
        <form ref="form">
          <div class="form-group">
            <label for="tanggapan" class="col-form-label">Tanggapan</label>
            <input type="text" name="tanggapan" class="form-control" id="tanggapan" 
            placeholder="Beri Tanggapan Disini" v-model="tanggapan">
          </div>
        </form>
    </b-modal>

    <b-modal 
      id="modalStatus"
      @ok="changeStatus"
    >
      <template v-slot:modal-title>
        Ubah Status Pengaduan
      </template>
        <form ref="form">         
          <div class="form-group">
            <label for="status" class="col-form-label">Status</label>
            <select class="form-control" v-model="status">
              <option value="terkirim">Terkirim</option>
              <option value="proses">Proses</option>
              <option value="selesai">Selesai</option>
              <option value="tolak">Tolak</option>
            </select>
          </div>
        </form>
    </b-modal>

  </div>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'

export default {
  data : function(){
    return {
      search: "",
      reportp: "",
      reportk: "",
      reportt: "",
      reports: "",
      id_user: "",
      nik: "",
      nama: "",
      telp: "",
      username: "",
      id_pengaduan: "",
      id_kategori: "",
      nama_kategori: "",
      tgl_pengaduan: "",
      isi_laporan: "",
      foto: "",
      status: "",
      tanggapan: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      pengaduan: [],
      tanggapan: [],
      kategori: [],
      user: [],
      fields: ["id_user","tgl_pengaduan", "isi_laporan", "foto", "kategori", "status", "tanggapan", "Aksi"],
    }
  },

  components: {
        VueHtml2pdf
  },

  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios.get("/pengaduan", conf)
      .then(response => {
        if(response.data.success){
          this.$bvToast.hide("loadingToast");
          this.pengaduan = response.data.data.pengaduan;
          // this.tanggapan = response.data.data.pengaduan.tanggapan;
          this.rows = response.data.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data pengaduan atau anda bukan admin"
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }
        
      })
      .catch(error => {
        console.log(error.response.data.message);
      });
    },

    pagination : function(){
      if(this.search == ""){
        this.getData();
      } else {
        this.searching();
      }
    },

    ChangeStatus : function(item){
      this.action = "changestatus";
      this.id_pengaduan = item.id_pengaduan;
      this.status = item.status;
    },

    AddTanggapan : function(item){
      this.action = "addtanggapan";
      this.id_pengaduan = item.id_pengaduan;
      this.tgl_tanggapan = "";
    },

    changeStatus : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
        let form = new FormData();
        form.append("id_pengaduan", this.id_pengaduan);
        form.append("status", this.status);
        this.axios.post("/pengaduan/status", form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
         
          this.message = response.data.message;
          this.$bvToast.show("message");
           if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
        })
        .catch(error => {
          console.log(error);
        });  
    },

    Tanggapan : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      if(this.action == "addtanggapan"){
        let form = new FormData();
        form.append("id_pengaduan", this.id_pengaduan);
        form.append("tanggapan", this.tanggapan);
        this.axios.post("/pengaduan/tanggapan", form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });  
      }  
    },

getKategori : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios.get("/kategori", conf)
      .then(response => {
        if(response.data.success){
          this.$bvToast.hide("loadingToast");
          this.kategori = response.data.data.kategori;
          this.rows = response.data.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data kategori."
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }        
      })
      .catch(error => {
        console.log(error);
      });
    },

    pagination : function(){
      if(this.search == ""){
        this.getKategori();
      } else {
        this.searching();
      }
    },


    Add : function(){
      this.action = "insert";
      this.tanggapan = "";
      this.id_pengaduan= "";
    },

   
    generateReport (id) {
       let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      
       this.$bvToast.show("loadingToast");
       this.axios.get("/pengaduan/" + id, conf)
       .then(response => {
          if(response.data.success == true){
          this.$bvToast.hide("loadingToast");
          this.reportp = response.data.data.pengaduan[0];
          this.reports = response.data.data.pengaduan[0].user;
          this.reportt = response.data.data.pengaduan[0].tanggapan;
          this.reportk = response.data.data.pengaduan[0].kategori;
          this.$refs.html2Pdf.generatePdf()
          } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data pengaduan."
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }
      })
      .catch(error => {
        console.log(error.response.data.message);
      });
    },
  },

  mounted(){
    this.key = localStorage.getItem("Authorization");
    this.getData();

  }
}
</script>

<style scoped>
body {
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				text-align: center;
				color: #777;
			}

			body h1 {
				font-weight: 300;
				margin-bottom: 0px;
				padding-bottom: 0px;
				color: #000;
			}

			body h3 {
				font-weight: 300;
				margin-top: 10px;
				margin-bottom: 20px;
				font-style: italic;
				color: #555;
			}

			body a {
				color: #06f;
			}

			.invoice-box {
				max-width: 800px;
				margin: auto;
				padding: 30px;
				border: 1px solid #eee;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
				font-size: 16px;
				line-height: 24px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
				border-collapse: collapse;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 40px;
			}

			.invoice-box table tr.heading td {
				background: #eee;
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}

				.invoice-box table tr.information table td {
					width: 100%;
					display: block;
					text-align: center;
				}
			}
</style>