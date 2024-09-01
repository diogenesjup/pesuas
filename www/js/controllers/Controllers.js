class App {
//window.history.pushState(e, '"' + e+ '"', paginaSessao+'#' + e);
    constructor(appId, appName, appVersion, appOs, ambiente, token, tokenSms, apiLogin, apiSenha) {

        this.appId = appId;
        this.appName = appName;
        this.appVersion = appVersion;        
        this.appOs = appOs;

        this.views = new Views();
        this.sessao = new Sessao();
        this.models = new Models();
        this.helpers = new Helpers(); 

        if(ambiente=="HOMOLOGACAO"){
             
            this.urlDom = "http://127.0.0.1:8080/atomic/app/www/";
            this.urlApi = "https://diogenesjunior.com.br/api/";
            this.urlCdn = "http://127.0.0.1:8080/atomic/cdn/";

        }
        if(ambiente=="PRODUCAO"){

            this.urlDom = "";
            this.urlApi = "";
            this.urlCdn = "";

        }

        this.token = token;
        this.tokenSms = tokenSms;

        this.apiLogin = apiLogin;
        this.apiSenha = apiSenha;

        this.omniToken = "";
        
    }
    
    getVersion() {

        return this.appVersion;
    }

    getOs(){

        return this.appOs;
    }

    buscarDados(){

        jQuery("#conteudoPrincipal").html(`
            
            <div class="carregando-pre">
                <img src="images/loading.gif" />
                <p style="text-align:center;font-size:13px">
                    Aguarde...<br>
                    Estamos carregando as informações
                </p>
            </div>
            
        `);

        setTimeout(function(){
            app.models.buscarDados();
        } , 3000);

        setTimeout(function(){
            jQuery("#conteudoPrincipal .carregando-pre").append(`
            
               <p style="text-align:center;padding:30px;padding-bottom:10px;">
                 Problemas de conexão, ou sem internet? Não se preocupe, vamos salvar todas as informações na memória do seu dispositivo
               </p>
               <p style="text-align:center;padding:30px;padding-bottom:10px;">
                    <a 
                        href="" 
                        onclick="montarListaDeFormularios();" 
                        class="inline-flex px-5 py-3 text-white bg-purple-600 rounded-md mb-3"
                    >
                        Continuar offline
                    </a>
               </p>    

                
            `);
           
        } , 7500);

       

        
    }
    
    initApp(elemento){

        this.views.viewPrincipal();

        // VERIFICAR SE A API ESTÁ OK
        this.models.testeApi();

        // VERIFICAR SE O USUÁRIO ESTÄ LOGADO
        this.sessao.verificarLogado();

    }

    inicio(){

        //this.views.viewPrincipal();
        //this.views.ativarMenuUm();

        //console.log("Direcionar o usuário para a Dashboard app.inicio()");
        location.href="dashboard.html";

    }

    login(idUsuario,emailUusario,dadosUsuario){
   
        this.sessao.logarUsuario(idUsuario,emailUusario,dadosUsuario);
   
    }

    
    procLogin(form){

        // EXIBIR O ALERTA DE CARREGANDO
        var toastID = document.getElementById('toast-carregando');
        toastID = new bootstrap.Toast(toastID);
        toastID.show();

        var instancia = this;

        // ENVIAR OS DADOS SÓ DEPOIS DE 5 SEGUNDOS
        setTimeout(function(){ 
            instancia.models.procLogin(form);
        }, 5000);

        
        

    }
    

    salvarMeusDados(form){

        // EXIBIR O ALERTA DE CARREGANDO
        var toastID = document.getElementById('toast-carregando');
        toastID = new bootstrap.Toast(toastID);
        toastID.show();

        app.models.salvarDadosBancarios();
        
        //this.models.salvarMeusDados(form);
        setTimeout(function(){ 
            document.getElementById('sucessoEnvioMsg').click(); 
        }, 5000);

        

    }
    

    logoff(){
       
        localStorage.clear();
        this.sessao.deslogarUusario();

    }

  

    procCadastro(form){
        
        // EXIBIR O ALERTA DE CARREGANDO
        var toastID = document.getElementById('toast-carregando');
        toastID = new bootstrap.Toast(toastID);
        toastID.show();

        this.models.procCadastro(form);
        //this.views.cadastroPasso2();
    }
    
    

    procResetSenha(form){

        // EXIBIR O ALERTA DE CARREGANDO
        var toastID = document.getElementById('toast-carregando');
        toastID = new bootstrap.Toast(toastID);
        toastID.show();

        this.models.procResetSenha(form);
    }

   
 

}


class Sessao{
    
	constructor(){
	      
	     this.logado = "nao-logado";
	     this.bdLogado = localStorage.getItem("bdLogado");
	     this.idUsuario = localStorage.getItem("idUsuario");
	     this.emailUsuario = localStorage.getItem("emailUsuario");
	     this.dadosUsuario = localStorage.getItem("dadosUsuario");

	}
    
    logarUsuario(idUsuario,emailUusario,dadosUsuario){
    	this.logado = "logado";
    	this.idUsuario = idUsuario;
    	this.dadosUsuario = dadosUsuario;
        localStorage.setItem("dadosUsuario",JSON.stringify(dadosUsuario));
    	localStorage.setItem("bdLogado","logado");
        localStorage.setItem("idUsuario",this.idUsuario);

        // REMOVER A CLASSE QUE IMPEDE QUE O RODAPÉ SEJA ADICIONADO AO CALCULO DA ALTURA
        //$("section#content").removeClass("nao-logado");
        
        // DIRECIONAR O USUÁRIO PARA O INÍCIO
    	app.inicio();
    }

    verificarLogado(){
      
	      if(localStorage.getItem("bdLogado")=="logado"){
	      	
            location.href="dashboard.html";
	      	
	      }else{
             
          }

    }

    deslogarUusario(){
    	this.logado = "nao-logado";
    	localStorage.setItem("bdLogado","nao-logado");
    	localStorage.clear();
        location.href="index.html?logoff=true";
    }

}