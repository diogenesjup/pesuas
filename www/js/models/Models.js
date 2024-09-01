class Models{
    

    // TESTAR A DISPONIBILIDADE DA API
    testeApi(){
                
             console.log("TESTE API DESATIVADO");   

    }
    
    buscarDados(){

        if (navigator.onLine) {

                        // CONFIGURAÇÕES AJAX VANILLA
                        let xhr = new XMLHttpRequest();
                                                            
                        xhr.open('GET', "https://pesuas.com/wp-json/pesuas/v1/sinc",true);
                        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        

                        var params = "token="+app.token;

                        console.log("Dados que vamos enviar");
                        console.log(params);
                        
                        // INICIO AJAX VANILLA
                        xhr.onreadystatechange = () => {

                        if(xhr.readyState == 4) {

                            if(xhr.status == 200) {

                                console.log("OPERAÇÃO REALIZADA COM SUCESSO");
                                console.log(JSON.parse(xhr.responseText));

                                var dados = JSON.parse(xhr.responseText);

                                // SALVAR DADOS NA PERSISTÊNCIA DA MEMÓRIA DO APP
                                localStorage.setItem("dadosAPI",JSON.stringify(dados));

                                montarListaDeFormularios();
                                //montarFormulario(dados);
                                
                            }else{
                            
                                console.log("SEM SUCESSO buscarDados()");
                                console.log(xhr.responseText);

                                document.getElementById('msgErroLoginSenha2').click();
                                
                            }

                        }
                    }; // FINAL AJAX VANILLA

                    /* EXECUTA */
                    xhr.send(params);

                } else {

                    // Caso esteja offline
                    console.log("Sem conexão com a Internet.");
                    var dados = JSON.parse(localStorage.getItem("dadosAPI"));
                    if (dados) {
                        // Se existirem dados no localStorage, prosseguir com o fluxo offline
                        montarListaDeFormularios();
                    } else {
                        // Se não houver dados salvos, chamar a função semInternet
                        semInternet();
                    }
                    
                }

                

    }

    // PROC LOGIN
    procLogin(form){

        
                     var email = jQuery("#form1a").val();
                     var senha = jQuery("#form1b").val();

                     // CONFIGURAÇÕES AJAX VANILLA
                     let xhr = new XMLHttpRequest();
                                            
                     xhr.open('POST', "https://parceiro.atomiclabs.com.br/wp-json/atomiclabs/v1/auth/",true);
                     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    

                     var params = "token="+app.token+"&email="+email+"&senha="+senha;

                     console.log("Dados que vamos enviar");
                     console.log(params);
                     
                     // INICIO AJAX VANILLA
                     xhr.onreadystatechange = () => {

                     if(xhr.readyState == 4) {

                         if(xhr.status == 200) {

                             console.log("OPERAÇÃO REALIZADA COM SUCESSO");
                             console.log(JSON.parse(xhr.responseText));

                             var dados = JSON.parse(xhr.responseText);

                             if(dados.sucesso==200){

                                if(dados.pavs_is_vendedor=="sim" || dados.pavs_is_vendedor=="Sim"){

                                        localStorage.setItem("idVendedorLogado",dados.id_usuario);
                                        localStorage.setItem("vendedorChavePix",dados.chave_pix);
                                        localStorage.setItem("vendedorTitularPix",dados.titular_pix);
                                        localStorage.setItem("vendedorTipoChavePix",dados.tipo_chave_pix);
                                        localStorage.setItem("vendedorCpfTitularPix",dados.cpf_titular_pix);

                                        location.href="dashboard.html";

                                }else{
                                       
                                    document.getElementById('msgErroLoginSenha3').click();

                                }

                             }else{
                                 
                                 document.getElementById('msgErroLoginSenha2').click();
                                 
                             }
                             
                         }else{
                         
                             console.log("SEM SUCESSO procLogin()");
                             console.log(xhr.responseText);

                             document.getElementById('msgErroLoginSenha2').click();
                            
                         }

                     }
                 }; // FINAL AJAX VANILLA

                 /* EXECUTA */
                 xhr.send(params);

            
    }

    preSaques(){

                    // CONFIGURAÇÕES AJAX VANILLA
                     let xhr = new XMLHttpRequest();
                                            
                     xhr.open('POST', "https://parceiro.atomiclabs.com.br/wp-json/atomiclabs/v1/saques/",true);
                     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                     var params = "token="+app.token+"&idUsuario="+localStorage.getItem("idVendedorLogado");
                     
                     // INICIO AJAX VANILLA
                     xhr.onreadystatechange = () => {

                     if(xhr.readyState == 4) {

                         if(xhr.status == 200) {

                             console.log("OPERAÇÃO REALIZADA COM SUCESSO");
                             console.log(JSON.parse(xhr.responseText));

                             var dados = JSON.parse(xhr.responseText);

                              if (dados.sucesso == 200) {
                                        var saquesContainer = document.getElementById('saquesSolicitados');

                                        if(saquesContainer){

                                            saquesContainer.innerHTML = ''; // Limpa o conteúdo existente

                                        }

                                        if(dados.saldo==""){
                                            dados.saldo = 0;
                                        }
                                        if(dados.saldo_bloqueado==""){
                                            dados.saldo_bloqueado = 0;
                                        }

                                        $("#saldoVendedor").html(`

                                            <h2>
                                                <small>SEU SALDO</small>
                                                R$ ${dados.saldo}
                                            </h2>

                                        `);

                                        $("#btnNewSolicSaque").attr("onclick",'confirmacaoPreSaque('+dados.saldo+')');


                                        $("#saldoFuturoVendedor").html(`

                                            <h2>
                                                <small>SALDO BLOQUEADO</small>
                                                R$ ${dados.saldo_bloqueado}
                                            </h2>

                                        `);


                                        dados.saques.forEach(saque => {
                                            
                                            var statusImg = saque.status === 'Em andamento' ? 'images/time.svg' : 'images/6586148_accept_check_good_mark_ok_icon.svg';
                                            var statusBg  = saque.status === 'Em andamento' ? '' : 'style="background:none;"';

                                            if(saque.status == 'Aguardando'){
                                                statusImg = 'images/time.svg';
                                            }

                                            if(saque.status != 'Aguardando'){
                                                statusImg = 'images/6586148_accept_check_good_mark_ok_icon.svg';
                                            }

                                            if(saque.status == 'Cancelado'){
                                                statusImg = 'images/222.png';
                                            }

                                            var arquivoHtml = "";

                                            if(saque.arquivo_comprovante!="" && saque.arquivo_comprovante!=null){
                                                arquivoHtml = `
                                                    <a 
                                                        href="" 
                                                        title="baixar comprovante"
                                                        onclick="abrirUrlBrowser('${saque.arquivo_comprovante}')"
                                                        style="color:#000;"
                                                    >
                                                        Baixar comprovante
                                                    </a>
                                                `;
                                            }

                                            var saqueHTML = `
                                                <div class="caixa-solicitacao-saque">
                                                    <div class="diogenes-row">
                                                        <div class="diogenes-col-7">
                                                            <h3>#SAQUE${saque.ID}</h3>
                                                            <p>
                                                                <b>Data solicitação:</b> ${saque.data_solicitacao} <br>
                                                                <b>Valor:</b> R$${saque.valor_saque} <br>
                                                                ${arquivoHtml}
                                                            </p>
                                                        </div> 
                                                        <div class="diogenes-col-5">
                                                            ${saque.status.toUpperCase()} <img src="${statusImg}" ${statusBg} alt="">
                                                        </div> 
                                                    </div>
                                                </div>
                                            `;

                                            if(saquesContainer){ 
                                                saquesContainer.innerHTML += saqueHTML;
                                            }

                                        });

                                    } else {
                                        // Lida com respostas não bem-sucedidas
                                    }
                             
                         }else{
                         
                             console.log("SEM SUCESSO preSaques()");
                             console.log(JSON.parse(xhr.responseText));

                             document.getElementById('msgErroLoginSenha').click();
                            
                         }

                     }
                 }; // FINAL AJAX VANILLA

                 /* EXECUTA */
                 xhr.send(params);


    }

    salvarDadosBancarios(){

            var idUsuario    = localStorage.getItem("idVendedorLogado");
            var nomeTitular  = $("#nomeTitular").val();
            var chavePix     = $("#chavePix").val();
            var tipoChavePix = $("#tipoChavePix").val();

            localStorage.setItem("vendedorChavePix",chavePix);
            localStorage.setItem("vendedorTitularPix",nomeTitular);
            localStorage.setItem("vendedorTipoChavePix",tipoChavePix);



                     // CONFIGURAÇÕES AJAX VANILLA
                     let xhr = new XMLHttpRequest();
                                            
                     xhr.open('POST', "https://parceiro.atomiclabs.com.br/wp-json/atomiclabs/v1/salvar-dados-bancarios/",true);
                     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                     var params = "token="+app.token+"&idUsuario="+idUsuario+"&nomeTitular="+nomeTitular+"&chavePix="+chavePix+"&tipoChavePix="+tipoChavePix;
                     
                     // INICIO AJAX VANILLA
                     xhr.onreadystatechange = () => {

                     if(xhr.readyState == 4) {

                         if(xhr.status == 200) {

                             console.log("OPERAÇÃO REALIZADA COM SUCESSO");

                             console.log(JSON.parse(xhr.responseText));

                             var dados = JSON.parse(xhr.responseText);

                            if (dados.sucesso == 200) {
                                        

                            } else {
                                // Lida com respostas não bem-sucedidas
                            }
                             
                         }else{
                         
                             console.log("SEM SUCESSO salvarDadosBancarios()");
                             console.log(JSON.parse(xhr.responseText));

                             document.getElementById('msgErroLoginSenha').click();
                            
                         }

                     }
                 }; // FINAL AJAX VANILLA

                 /* EXECUTA */
                 xhr.send(params);

    }



    enviarSaque(valorSaque){

        var idUsuario    = localStorage.getItem("idVendedorLogado");
       
                     // CONFIGURAÇÕES AJAX VANILLA
                     let xhr = new XMLHttpRequest();
                                            
                     xhr.open('POST', "https://parceiro.atomiclabs.com.br/wp-json/atomiclabs/v1/solic-saque/",true);
                     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                     var params = "token="+app.token+"&idUsuario="+idUsuario+"&saldo="+valorSaque;
                     
                     // INICIO AJAX VANILLA
                     xhr.onreadystatechange = () => {

                     if(xhr.readyState == 4) {

                         if(xhr.status == 200) {

                            console.log("OPERAÇÃO REALIZADA COM SUCESSO");
                            console.log(JSON.parse(xhr.responseText));

                            var dados = JSON.parse(xhr.responseText);

                            if (dados.sucesso == 200) {
                                        

                            } else {
                                // Lida com respostas não bem-sucedidas
                            }
                             
                         }else{
                         
                             console.log("SEM SUCESSO enviarSaque()");
                             console.log(JSON.parse(xhr.responseText));

                             document.getElementById('msgErroLoginSenha').click();
                            
                         }

                     }
                 }; // FINAL AJAX VANILLA

                 /* EXECUTA */
                 xhr.send(params);

    }









    // PROC CADASTRO
    procCadastro(form){

                var dadosForm = $(form).serialize();

                // CONFIGURAÇÕES AJAX VANILLA
                let xhr = new XMLHttpRequest();
                
                xhr.open('POST', app.urlApi+'auth/cadastro/',true);
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                var params = "token="+app.token+
                            "&"+dadosForm;
                
                // INICIO AJAX VANILLA
                xhr.onreadystatechange = () => {

                if(xhr.readyState == 4) {

                    if(xhr.status == 200) {

                        console.log("OPERAÇÃO REALIZADA COM SUCESSO");
                        console.log(JSON.parse(xhr.responseText));

                        var dados = JSON.parse(xhr.responseText);

                        if(dados.sucesso==403){

                            document.getElementById('msgCadastro').click();

                        }else{
                            
                            // LOGIN OK
                            //app.login(dados.dados[0].id,dados.dados[0].email,dados.dados[0]);

                            // CADASTRO OK
                            localStorage.setItem("cadastroOk",2);

                            location.href="index.html";
                            

                        }
                        
                    }else{
                    
                        console.log("SEM SUCESSO procCadastro()");
                        console.log(JSON.parse(xhr.responseText));
                        document.getElementById('msgErroLoginSenha').click();

                    }

                }
            }; // FINAL AJAX VANILLA

            /* EXECUTA */
            xhr.send(params);
  
  
    }


    



    // RESET DE SENHA  
    procResetSenha(form){

                var dadosForm = $(form).serialize();

                // CONFIGURAÇÕES AJAX VANILLA
                let xhr = new XMLHttpRequest();
                
                xhr.open('POST', app.urlApi+'auth/reset-senha/',true);
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                var params = "token="+app.token+
                            "&"+dadosForm;
                
                // INICIO AJAX VANILLA
                xhr.onreadystatechange = () => {

                if(xhr.readyState == 4) {

                    if(xhr.status == 200) {

                        console.log("OPERAÇÃO REALIZADA COM SUCESSO");
                        console.log(JSON.parse(xhr.responseText));

                        var dados = JSON.parse(xhr.responseText);

                        if(dados.sucesso==403){

                            document.getElementById('msgErroLoginSenha').click();

                        }else{
                            
                            document.getElementById('msgSucessoReset').click();
                        }
                        
                    }else{
                    
                        console.log("SEM SUCESSO procResetSenha()");
                        console.log(JSON.parse(xhr.responseText));

                        document.getElementById('msgErroLoginSenha').click();

                    }

                }
            }; // FINAL AJAX VANILLA

            /* EXECUTA */
            xhr.send(params);

    }

    getDescontos(){

        console.log("TENTADO OBTER OS DESCONTOS...");

         // CONFIGURAÇÕES AJAX VANILLA
         let xhr = new XMLHttpRequest();
                                
         xhr.open('GET', "https://parceiro.atomiclabs.com.br/wp-json/atomiclabs/v1/vendedor/"+localStorage.getItem("idVendedorLogado")+"/descontos",true);
         xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

         var params = "token="+app.token;
         
         // INICIO AJAX VANILLA
         xhr.onreadystatechange = () => {

         if(xhr.readyState == 4) {

             if(xhr.status == 200) {

                 console.log("OPERAÇÃO REALIZADA COM SUCESSO");
                 console.log(JSON.parse(xhr.responseText));

                 var dados = JSON.parse(xhr.responseText);

                 if(dados.sucesso==200){

                    localStorage.setItem("descontosVendedor",JSON.stringify(dados));

                 }else{
                     
                     
                 }
                 
             }else{
             
                 console.log("SEM SUCESSO getDescontos()");
                 console.log(JSON.parse(xhr.responseText));
                
                 
             }

         }
     }; // FINAL AJAX VANILLA

     /* EXECUTA */
     xhr.send(params);


    }
    getProdutos(){
        
            console.log("TENTADO OBTER OS PRODUTOS...");

                        // CONFIGURAÇÕES AJAX VANILLA
                        let xhr = new XMLHttpRequest();
                                
                        xhr.open('GET', "https://atomiclabs.com.br/wp-json/atomiclabs/v1/produtos",true);
                        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                        var params = "token="+app.token;
                        
                        // INICIO AJAX VANILLA
                        xhr.onreadystatechange = () => {

                        if(xhr.readyState == 4) {

                            if(xhr.status == 200) {

                                console.log("OPERAÇÃO REALIZADA COM SUCESSO");
                                console.log(JSON.parse(xhr.responseText));

                                var dados = JSON.parse(xhr.responseText);

                                if(dados.sucesso==200){

                                   

                                    console.log("CONSULTAR DESCONTOS");
                                    var descontos = JSON.parse(localStorage.getItem("descontosVendedor"));
                                    console.log(descontos);

                                    localStorage.setItem("produtos",JSON.stringify(dados.dados));

                                    var htmlExtraCupons = "";

                                    if(descontos){
                                        htmlExtraCupons = `
                                            <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 4px;font-weight: bold;margin-top: -30px;margin-bottom: 19px;line-height:14px;">
                                                Até ${descontos.cupons[0].comissao_que_o_vendedor_ganha}% de comissão e ${descontos.max}% de desconto
                                            </span>
                                        `;
                                    }else{
                                        htmlExtraCupons = `
                                            <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 4px;font-weight: bold;margin-top: -30px;margin-bottom: 19px;line-height:14px;">
                                                Até ${descontos.max}% de desconto
                                            </span>
                                        `;
                                    }

                                    // PREPARAR E MONTAR O HTML
                                    // Mapear cada produto para uma string HTML e juntá-las
                                    var produtosHTML = dados.dados.map(produto => {
                                        return `
                                            <div class="col-6 pe-2">
                                                <div class="card card-style mx-0">
                                                    <img src="${produto.featured_image}" class="img-fluid"  onclick="app.views.verProduto(${produto.product_id});">
                                                    <div class="px-2">
                                                        <p class="color-highlight font-600 mb-n1 pt-1">Suplementos</p>
                                                        <h2 style="margin-bottom: -1px;">${produto.title}</h2>
                                                        <h5 class="font-14">R$${produto.price}</h5>
                                                        <p class="font-11 line-height-s">
                                                            ${produto.short_description}
                                                        </p>
                                                        ${
                                                            produto.comissao_dif === "Sim"
                                                            ? `<span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;margin-top: -30px;margin-bottom: 19px;">
                                                                ${produto.comissao_dif_val}% de comissão!
                                                            </span>`
                                                            : `
                                                                ${htmlExtraCupons}
                                                            `
                                                        }
                                                        <a href="" onclick="app.views.verProduto(${produto.product_id});" class="btn btn-s btn-full border-highlight rounded-s color-highlight mb-3"><i class="fa fa-bullhorn" aria-hidden="true"></i> VER DETALHES</a>
                                                    </div>
                                                </div>
                                            </div>`;
                                    }).join('');

                                    $(".carregando-contatos").hide();
                                    $(".carregando-contatos-vazio").hide();

                                    // Inserir HTML no contêiner de produtos
                                    $('#produtosAtomicContinaer').html(produtosHTML);




                                }else{
                                    
                                    $(".carregando-contatos-vazio").show();

                                }
                                
                            }else{
                            
                                console.log("SEM SUCESSO getProdutos()");
                                console.log(JSON.parse(xhr.responseText));
                                $(".carregando-contatos-vazio").show();
                                

                            }

                        }
                    }; // FINAL AJAX VANILLA

                    /* EXECUTA */
                    xhr.send(params);


    }

    getProdutosForSearch(){
        
            console.log("TENTADO OBTER OS PRODUTOS...");

                        // CONFIGURAÇÕES AJAX VANILLA
                        let xhr = new XMLHttpRequest();
                                
                        xhr.open('GET', "https://atomiclabs.com.br/wp-json/atomiclabs/v1/produtos",true);
                        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                        var params = "token="+app.token;
                        
                        // INICIO AJAX VANILLA
                        xhr.onreadystatechange = () => {

                        if(xhr.readyState == 4) {

                            if(xhr.status == 200) {

                                console.log("OPERAÇÃO REALIZADA COM SUCESSO");
                                console.log(JSON.parse(xhr.responseText));

                                var dados = JSON.parse(xhr.responseText);

                                if(dados.sucesso==200){

                                   
                                    console.log("CONSULTAR DESCONTOS");
                                    var descontos = JSON.parse(localStorage.getItem("descontosVendedor"));
                                    console.log(descontos);


                                    // PREPARAR E MONTAR O HTML
                                    // Mapear cada produto para uma string HTML e juntá-las
                                    var produtosHTML = dados.dados.map(produto => {

                                        var htmlExtraCupons = "";

                                        if(descontos){
                                            htmlExtraCupons = `

                                                    <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 4px;font-weight: bold;margin-top: -30px;margin-bottom: 19px;line-height:14px;">
                                                        Até ${descontos.cupons[0].comissao_que_o_vendedor_ganha}% de comissão e ${descontos.max}% de desconto
                                                    </span>
                                            
                                            `;
                                        }else{
                                            htmlExtraCupons = `

                                                    <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 4px;font-weight: bold;margin-top: -30px;margin-bottom: 19px;line-height:14px;">
                                                        Até ${descontos.max}% de desconto
                                                    </span>
                                            
                                            `;
                                        }

                                        return `
                                            <div class="col-6 pe-2" data-filter-item data-filter-name="${produto.title} ${produto.short_description}">
                                                <div class="card card-style mx-0">
                                                    <img src="${produto.featured_image}" class="img-fluid"  onclick="app.views.verProduto(${produto.product_id});">
                                                    <div class="px-2">
                                                        <p class="color-highlight font-600 mb-n1 pt-1">Suplementos</p>
                                                        <h2 style="margin-bottom: -1px;">${produto.title}</h2>
                                                        <h5 class="font-14">R$${produto.price}</h5>
                                                        <p class="font-11 line-height-s">
                                                            ${produto.short_description}
                                                        </p>
                                                        ${
                                                            produto.comissao_dif === "Sim"
                                                            ? `<span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;margin-top: -30px;margin-bottom: 19px;">
                                                                ${produto.comissao_dif_val}% de comissão!
                                                            </span>`
                                                            : `
                                                                ${htmlExtraCupons}
                                                            `
                                                        }
                                                        <a href="" onclick="app.views.verProduto(${produto.product_id});" class="btn btn-s btn-full border-highlight rounded-s color-highlight mb-3">VER DETALHES</a>
                                                    </div>
                                                </div>
                                            </div>`;
                                    }).join('');

                                    //$(".carregando-contatos").hide();
                                    //$(".carregando-contatos-vazio").hide();

                                    // Inserir HTML no contêiner de produtos
                                    $('#listaContatosPesquisa').html(produtosHTML);




                                }else{
                                    
                                    //$(".carregando-contatos-vazio").show();

                                }
                                
                            }else{
                            
                                console.log("SEM SUCESSO getProdutosforSearch()");
                                console.log(JSON.parse(xhr.responseText));
                                //$(".carregando-contatos-vazio").show();
                                

                            }

                        }
                    }; // FINAL AJAX VANILLA

                    /* EXECUTA */
                    xhr.send(params);


    }

    getContatos(){

                     // CONFIGURAÇÕES AJAX VANILLA
                     let xhr = new XMLHttpRequest();

                     var idUsuario = localStorage.getItem("idVendedorLogado");
                     
                                            
                     xhr.open('POST', "https://parceiro.atomiclabs.com.br/wp-json/atomiclabs/v1/historicos/",true);
                     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                     var params = "token="+app.token+"&idUsuario="+idUsuario;
                     
                     // INICIO AJAX VANILLA
                     xhr.onreadystatechange = () => {

                     if(xhr.readyState == 4) {

                         if(xhr.status == 200) {

                             console.log("OPERAÇÃO REALIZADA COM SUCESSO");
                             console.log(JSON.parse(xhr.responseText));

                             var dados = JSON.parse(xhr.responseText);

                             if(dados.sucesso==200){

                                console.log("TEMOS DADOS");
                                $(".carregando-contatos").hide();
                                $(".carregando-contatos-vazio").hide();

                                if(dados.saldo==""){
                                    dados.saldo = 0;
                                }

                                if(dados.saldo_bloqueio==""){
                                    dados.saldo_bloqueio = 0;
                                }

                                $("#saldoVendedor").html(`

                                    <h2>
                                        <small>SEU SALDO</small>
                                        R$ ${dados.saldo}
                                    </h2>

                                `);

                                $("#saldoFuturoVendedor").html(`

                                    <h2>
                                        <small>SALDO FUTURO</small>
                                        R$ ${dados.saldo_futuro}
                                    </h2>

                                `);

                                if(dados.pedidos.length==0){
                                    $(".carregando-contatos-vazio").fadeIn("500"); 
                                }else{

                                    localStorage.setItem("totVendasVendedorParaGrafico",dados.pedidos.length);

                                    var htmlPedidos = dados.pedidos.map(pedido => {

                                        var estilo = 'style="display:block;"';

                                        if(pedido.pedido==undefined||pedido.pedido==""){
                                            pedido.pedido = "0000";
                                        }

                                        if(pedido.total_pedido==undefined||pedido.total_pedido==""){
                                            pedido.total_pedido = "0,00";
                                        }

                                        if(pedido.extra_conteudos==undefined||pedido.extra_conteudos==""){
                                            pedido.extra_conteudos = "N/A";
                                            estilo = 'style="display:none;"';
                                        }

                                        if(pedido.status_amigavel==undefined||pedido.status_amigavel==""){
                                            pedido.status_amigavel = "Aguardando";
                                        }

                                        if(pedido.extra_conteudos!="N/A"){

                                            pedido.extra_conteudos = pedido.extra_conteudos.replace(`Nome do cliente:`, '<br>Nome do cliente:');
                                            pedido.extra_conteudos = pedido.extra_conteudos.replace(`Nome do cliente:`, '<br>Nome do cliente:');


                                        return `
            
                                            <a 
                                                href="" 
                                                ${estilo}
                                                class="d-flex mb-3" 
                                                data-filter-item data-filter-name="${pedido.pedido} ${pedido.cupom} ${pedido.extra_conteudos}"
                                            >
                                                <div class="resumo-letra-contato">
                                                    #${pedido.pedido}
                                                </div>
                                                <div>
                                                    <h5 class="font-16 font-600">
                                                        #${pedido.pedido} - ${pedido.status_amigavel}
                                                    </h5>
                                                    <p class="line-height-s mt-1 opacity-90">
                                                        Total pedido: R$${pedido.total_pedido}<br>
                                                        ${pedido.extra_conteudos.replace(`<br>Comissão: Não<br>Comissão DIF: `, '')}
                                                    </p>
                                                </div>
                                                <div class="align-self-center ps-3">
                                                    <i class="fa fa-angle-right opacity-20"></i>
                                                </div>
                                            </a>
            
                                        `;
                                        }else{
                                            return '';
                                        }
                                    }).join('');

                                    $("#listaContatosListagem").html("<p style='margin-bottom:0px !important;'>&nbsp;</p>" + htmlPedidos);
                                    $("#listaContatosPesquisa").html(htmlPedidos);

                                }

                             }else{

                                console.log("NÃO TEMOS DADOS");
                                $(".carregando-contatos").hide();
                                $(".carregando-contatos-vazio").fadeIn("500"); 
                                 
                             }
                             
                         }else{
                         
                             console.log("SEM SUCESSO getContatos()");
                             console.log(JSON.parse(xhr.responseText));
                            
                         }

                     }
                 }; // FINAL AJAX VANILLA

                 /* EXECUTA */
                 xhr.send(params);


            

            // LISTAGEM GERAL
            jQuery("#listaContatosListagemD").html(`

                                <a href="" class="d-flex mb-3" data-filter-item data-filter-name="todos Diogenes Junior" style="padding-top:26px">
                        
                                    <div class="resumo-letra-contato">
                                        D
                                    </div>
                                    <div>
                                        <h5 class="font-16 font-600">Diogenes Junior</h5>
                                        <p class="line-height-s mt-1 opacity-90">Pedido #3920 <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;">Comissão R$12 (6%)</span></p>
                                    </div>
                                    <div class="align-self-center ps-3">
                                        <i class="fa fa-angle-right opacity-20"></i>
                                    </div>
                                </a>

                                <a href="" class="d-flex mb-3" data-filter-item data-filter-name="todos Ygor Kaza" style="padding-top:26px">
                    
                                    <div class="resumo-letra-contato">
                                        Y
                                    </div>
                                    <div>
                                        <h5 class="font-16 font-600">Ygor Kaza</h5>
                                        <p class="line-height-s mt-1 opacity-90">Pedido #3921 <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;">Comissão R$12 (6%)</span></p>
                                    </div>
                                    <div class="align-self-center ps-3">
                                        <i class="fa fa-angle-right opacity-20"></i>
                                    </div>
                                </a>

                                <a href="" class="d-flex mb-3" data-filter-item data-filter-name="todos Halley Hart" style="padding-top:26px">
                    
                                    <div class="resumo-letra-contato">
                                        H
                                    </div>
                                    <div>
                                        <h5 class="font-16 font-600">Halley Hart</h5>
                                        <p class="line-height-s mt-1 opacity-90">Pedido #3922 <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;">Comissão R$12 (6%)</span></p>
                                    </div>
                                    <div class="align-self-center ps-3">
                                        <i class="fa fa-angle-right opacity-20"></i>
                                    </div>
                                </a>

                                <a href="" class="d-flex mb-3" data-filter-item data-filter-name="todos Fernanda Paiola" style="padding-top:26px">
                    
                                    <div class="resumo-letra-contato">
                                        F
                                    </div>
                                    <div>
                                        <h5 class="font-16 font-600">Fernanda Paiola</h5>
                                        <p class="line-height-s mt-1 opacity-90">Pedido #3923 <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;">Comissão R$12 (6%)</span></p>
                                    </div>
                                    <div class="align-self-center ps-3">
                                        <i class="fa fa-angle-right opacity-20"></i>
                                    </div>
                                </a>

                                <a href="" class="d-flex mb-3" data-filter-item data-filter-name="todos Jorginho Vans" style="padding-top:26px">
                    
                                    <div class="resumo-letra-contato">
                                        J
                                    </div>
                                    <div>
                                        <h5 class="font-16 font-600">Jorginho Vans</h5>
                                        <p class="line-height-s mt-1 opacity-90">Pedido #3924 <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;">Comissão R$12 (6%)</span></p>
                                    </div>
                                    <div class="align-self-center ps-3">
                                        <i class="fa fa-angle-right opacity-20"></i>
                                    </div>
                                </a>

                                <a href="" class="d-flex mb-3" data-filter-item data-filter-name="todos Diogenes Junior" style="padding-top:26px">
                        
                                    <div class="resumo-letra-contato">
                                        D
                                    </div>
                                    <div>
                                        <h5 class="font-16 font-600">Diogenes Junior</h5>
                                        <p class="line-height-s mt-1 opacity-90">Pedido #3920 <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;">Comissão R$12 (6%)</span></p>
                                    </div>
                                    <div class="align-self-center ps-3">
                                        <i class="fa fa-angle-right opacity-20"></i>
                                    </div>
                                </a>

                                <a href="" class="d-flex mb-3" data-filter-item data-filter-name="todos Ygor Kaza" style="padding-top:26px">
                    
                                    <div class="resumo-letra-contato">
                                        Y
                                    </div>
                                    <div>
                                        <h5 class="font-16 font-600">Ygor Kaza</h5>
                                        <p class="line-height-s mt-1 opacity-90">Pedido #3921 <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;">Comissão R$12 (6%)</span></p>
                                    </div>
                                    <div class="align-self-center ps-3">
                                        <i class="fa fa-angle-right opacity-20"></i>
                                    </div>
                                </a>

                                <a href="" class="d-flex mb-3" data-filter-item data-filter-name="todos Halley Hart" style="padding-top:26px">
                    
                                    <div class="resumo-letra-contato">
                                        H
                                    </div>
                                    <div>
                                        <h5 class="font-16 font-600">Halley Hart</h5>
                                        <p class="line-height-s mt-1 opacity-90">Pedido #3922 <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;">Comissão R$12 (6%)</span></p>
                                    </div>
                                    <div class="align-self-center ps-3">
                                        <i class="fa fa-angle-right opacity-20"></i>
                                    </div>
                                </a>

                                <a href="" class="d-flex mb-3" data-filter-item data-filter-name="todos Fernanda Paiola" style="padding-top:26px">
                    
                                    <div class="resumo-letra-contato">
                                        F
                                    </div>
                                    <div>
                                        <h5 class="font-16 font-600">Fernanda Paiola</h5>
                                        <p class="line-height-s mt-1 opacity-90">Pedido #3923 <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;">Comissão R$12 (6%)</span></p>
                                    </div>
                                    <div class="align-self-center ps-3">
                                        <i class="fa fa-angle-right opacity-20"></i>
                                    </div>
                                </a>

                                <a href="" class="d-flex mb-3" data-filter-item data-filter-name="todos Jorginho Vans" style="padding-top:26px">
                    
                                    <div class="resumo-letra-contato">
                                        J
                                    </div>
                                    <div>
                                        <h5 class="font-16 font-600">Jorginho Vans</h5>
                                        <p class="line-height-s mt-1 opacity-90">Pedido #3924 <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;">Comissão R$12 (6%)</span></p>
                                    </div>
                                    <div class="align-self-center ps-3">
                                        <i class="fa fa-angle-right opacity-20"></i>
                                    </div>
                                </a>
                        
            `);



    }


}