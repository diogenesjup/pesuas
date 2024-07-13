class Views{
    
	constructor(){
	      
	     this._content = $("section#content"); 

	     this._allMenus = $("footer * a");
	     this._menu1 = $("footer .menu-1 a");
	     this._menu2 = $("footer .menu-2 a");
	     this._menu3 = $("footer .menu-3 a");

       this.header = $("header");
       this.footer = $("footer");

	}

	animarTransicao(){
		new WOW().init();
	}
    
    dashboard(){
        
        app.models.getContatos();
        app.models.getDescontos();
        //app.models.getProdutosForSearch();
        app.models.getProdutosForSearch();
        pesquisa();
    }

    produtos(){
        app.models.getContatos();
        app.models.getProdutos();
        app.models.getProdutosForSearch();
        pesquisa();
    }

    saques(){
        app.models.preSaques();
    }

    relatorios(){

        app.models.getContatos();
        app.models.getDescontos();

    }

    dadosBancarios(){
        if(localStorage.getItem("vendedorChavePix")!="" && localStorage.getItem("vendedorChavePix")!=null){

            var vendedorChavePix = localStorage.getItem("vendedorChavePix");
            var vendedorTitularPix = localStorage.getItem("vendedorTitularPix");
            var vendedorTipoChavePix = localStorage.getItem("vendedorTipoChavePix");

            $("#nomeTitular").val(vendedorTitularPix);
            $("#chavePix").val(vendedorChavePix);
            $("#tipoChavePix").val(vendedorTipoChavePix);

       }
    }

/**
*  ------------------------------------------------------------------------------------------------
*
*
*   VIEW PRODUTOS
*
*
*  ------------------------------------------------------------------------------------------------
*/
    verProduto(idProduto){

        $('.search-results').addClass("disabled-search-list");

        $('#produtosAtomicContinaer').html(`
        
                <div class="carregando-contatos text-center">
                    <i class="fa fa-sync fa-spin me-3"></i> carregando informações do produto
                </div>
        
        `);

        setTimeout(function(){
        

                        console.log("CONSULTAR DESCONTOS");
                        var descontos = JSON.parse(localStorage.getItem("descontosVendedor"));
                        console.log(descontos);

                        // RECUPERAR O PRODUTO
                        var produto;
                        var produtos = JSON.parse(localStorage.getItem("produtos"));

                        var p = 0;
                        while(p<produtos.length){
                            if(produtos[p].product_id==idProduto){
                                produto = produtos[p];
                            }
                            p++;
                        }
                        
                        if(descontos.cupom_custom){

                        }
                        var controle = 0;
                        var htmlCustom = "";

                        var htmlDescontos = descontos.cupons.map(desconto => {

                            
                            
                            if(descontos.cupom_personalizado!="" && descontos.cupom_personalizado != undefined && controle==0){
                                htmlCustom = `

                                <div style="display:none;font-weight:normal;background:#f2f2f2;padding:10px;border:2px dotted #000;width:420px;max-width:100%;font-size:1.12em;line-height: 23px;text-align:center;margin-top:30px;margin-bottom:30px;">
                                    <!--O <b>código de cupom</b> de identificação parceiro é: <br>--><b>${descontos.cupom_personalizado}</b><br>
                                    <a href="" class="copiar-codigo" onclick="copiarCodigo('.codigo-cupom-name-${descontos.cupom_personalizado}')">copiar código</a>
                                    &nbsp;&nbsp;&nbsp;
                                    <a href="" 
                                    class="copiar-codigo" 
                                    onclick='compartilharTexto("Use o meu cupom: ${descontos.cupom_personalizado} e ganhe desconto no carrinho. Acesse https://atomiclabs.com.br/?p=${produto.product_id}")'
                                    title="compartilhar">
                                    compartilhar
                                    </a>
                                </div>
                                
                                `; controle++;
                            }

                            var cupomDuplicata = "";

                            if(descontos.cupom_personalizado!="" && descontos.cupom_personalizado != undefined){
                                cupomDuplicata = `

                                        <div style="font-weight:normal;background:#fff;padding:10px;border:2px dotted #000;width:420px;max-width:100%;font-size:1.12em;line-height: 23px;text-align:center">
                                            O <b>código de cupom</b> de identificação parceiro é: <br><b>${descontos.cupom_personalizado}-${localStorage.getItem("idVendedorLogado")}-R${desconto.desconto_aplicado_ao_carrinho}</b><br>
                                            <a href="" class="copiar-codigo" onclick="copiarCodigo('.codigo-cupom-name2-${desconto.desconto_aplicado_ao_carrinho}')">copiar código</a>
                                            &nbsp;&nbsp;&nbsp;
                                            <a href="" 
                                            class="copiar-codigo" 
                                            onclick='compartilharTexto("Use o meu cupom: ${descontos.cupom_personalizado}-${localStorage.getItem("idVendedorLogado")}-R${desconto.desconto_aplicado_ao_carrinho} e ganhe desconto no carrinho. Acesse https://atomiclabs.com.br/?p=${produto.product_id}")'
                                            title="compartilhar">
                                            compartilhar
                                            </a>
                                        </div>
                                        
                                        <textarea 
                                            class="codigo-cupom-name2-${desconto.desconto_aplicado_ao_carrinho}" 
                                            style="height:0;width:0;opacity:0;">${descontos.cupom_personalizado}-${localStorage.getItem("idVendedorLogado")}-R${desconto.desconto_aplicado_ao_carrinho}</textarea>

                                `;
                            }

                            return `
                            
                            ${cupomDuplicata}

                            <div style="font-weight:normal;background:#fff;padding:10px;border:2px dotted #000;width:420px;max-width:100%;font-size:1.12em;line-height: 23px;text-align:center">
                                O <b>código de cupom</b> de identificação parceiro é: <br><b>COLAB-A2024-${localStorage.getItem("idVendedorLogado")}-R${desconto.desconto_aplicado_ao_carrinho}</b><br>
                                <a href="" class="copiar-codigo" onclick="copiarCodigo('.codigo-cupom-name-${desconto.desconto_aplicado_ao_carrinho}')">copiar código</a>
                                &nbsp;&nbsp;&nbsp;
                                <a href="" 
                                   class="copiar-codigo" 
                                   onclick='compartilharTexto("Use o meu cupom: COLAB-A2024-${localStorage.getItem("idVendedorLogado")}-R${desconto.desconto_aplicado_ao_carrinho} e ganhe desconto no carrinho. Acesse https://atomiclabs.com.br/?p=${produto.product_id}")'
                                   title="compartilhar">
                                   compartilhar
                                </a>
                            </div>
                            
                            <textarea 
                                class="codigo-cupom-name-${desconto.desconto_aplicado_ao_carrinho}" 
                                style="height:0;width:0;opacity:0;">COLAB-A2024-${localStorage.getItem("idVendedorLogado")}-R${desconto.desconto_aplicado_ao_carrinho}</textarea>

                            <small style="display: block;background: #f1ebdf;width: 420px;max-width: 100%;text-align: center;padding: 3px;margin-top: 2px;font-weight: normal;font-size: 14px;margin-bottom: 37px;margin-bottom: 37px;padding-top: 10px;padding-bottom: 14px;">
                                Com esses cupons descontos de até ${desconto.desconto_aplicado_ao_carrinho}% no carrinho 
                            </small>

                            `;
                        }).join('');

                        
                        $(`#produtosTitle`).html(`

                            Ver Produto
                        
                        `);
                        $(`#produtosTitle a`).fadeIn(500);

                        $(`#produtosAtomicContinaer`).html(`
                        
                                <div class="card card-style">
                                    <div class="card mb-0 rounded-0 bg-24" data-card-height="250" style="height: 250px;background:url('${produto.featured_image}') #f2f2f2 no-repeat;background-size:cover;backgroud-position:center center;">
                                        <div class="card-bottom">
                                            <a href="" onclick="abrirUrlBrowser('https://atomiclabs.com.br/?p=${produto.product_id}')" class="float-end btn btn-m font-700 bg-white rounded-s color-black mb-2 me-2">VER NO SITE</a>
                                            <!--<a href="#" class="float-end btn btn-m font-700 bg-white rounded-s color-black mb-2 me-2">COMPARTILHAR</a>-->
                                        </div>
                                    </div>
                                    <div class="content-d" style="padding-right:13px;">
                                        <p class="font-600 color-highlight mb-n1">Sobre o produto:</p>
                                        <h1 class="font-30 font-800">${produto.title}</h1>
                                        <p class="font-14 mb-3">
                                            ${produto.short_description}
                                        </p>
                                        <p class="opacity-80" style="font-size: 30px;font-weight: bold;color: #000;">
                                            R$${produto.price} 
                                        </p>
                                        <p>
                                            <span style="display: block;color: #118f2d;font-size: 12px;padding-top: 0px;font-weight: bold;font-size:21px">
                                                Até ${descontos.cupons[0].comissao_que_o_vendedor_ganha}% de comissão e ${descontos.max}% de desconto
                                            </span>
                                        </p>
                                        
                                        ${htmlCustom}

                                        <div style="display:none;font-weight:normal;background:#f2f2f2;padding:10px;border:2px dotted #000;width:420px;max-width:100%;font-size:1.12em;line-height: 23px;text-align:center;margin-top:30px;margin-bottom:30px;">
                                            <!--O <b>código de cupom</b> de identificação parceiro é: <br>--><b>COLAB-A2024-${localStorage.getItem("idVendedorLogado")} </b><br>

                                            <a href="" class="copiar-codigo" onclick="copiarCodigo('.codigo-cupom-name3')">
                                                copiar código
                                            </a>
                                                &nbsp;&nbsp;&nbsp;
                                            <a href="" 
                                            class="copiar-codigo" 
                                            onclick='compartilharTexto("Use o meu cupom: COLAB-A2024-${localStorage.getItem("idVendedorLogado")} e ganhe desconto no carrinho. Acesse https://atomiclabs.com.br/?p=${produto.product_id}")'
                                            title="compartilhar">
                                                compartilhar
                                            </a>

                                            <textarea 
                                            class="codigo-cupom-name3" 
                                            style="height:0;width:0;opacity:0;">COLAB-A2024-${localStorage.getItem("idVendedorLogado")}</textarea>

                                        </div>
                                        
                                        ${htmlDescontos}

                                    </div>
                                </div>
                        
                        `);


    }, 5000);


    }



/**
*  ------------------------------------------------------------------------------------------------
*
*
*   VIEW PRINCIPAL
*
*
*  ------------------------------------------------------------------------------------------------
*/
    viewPrincipal(){

           voltarAoTopo();

           this.header.html(`

              

           `);

            this._content.html(`
            
             
            
            `);

            this.animarTransicao();

            app.views.cssInicioLogado();

            app.views.ativarMenuUm();

            $("footer").fadeIn();

            /*
            if(localStorage.getItem("calibragem")==null){

                  app.views.calibragem();

            }
            */


    }



    desativarTodosMenus(){
    	this._allMenus.css("font-weight","normal");
    }

    ativarMenuUm(){
    	this.desativarTodosMenus();
       	this._menu1.css("font-weight","bold"); 
    }
    ativarMenuDois(){
    	this.desativarTodosMenus();
       	this._menu2.css("font-weight","bold"); 
    }
    ativarMenuTres(){
    	this.desativarTodosMenus();
       	this._menu3.css("font-weight","bold"); 
    }



}

