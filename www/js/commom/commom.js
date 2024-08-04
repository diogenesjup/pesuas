function abrirUrlBrowser(url){

  var options = "location=yes,hidden=no";
  var ref = cordova.InAppBrowser.open(url, "_blank", options);

}

function semInternet(){

}




var posicaoAtualFormulario = 1;
var superFormHomeUrl = "https://pesuas.com";

function montarListaDeFormularios(){

    var dados = JSON.parse(localStorage.getItem("dadosAPI"));

    let conteudoPrincipal = document.getElementById('conteudoPrincipal');

    var html = `
            <div class="content mb-2">
              <div class="list-group list-custom-small">
                  <div class="brand-logo" style="text-align: center;padding: 30px;">
                      <img src="images/logo-oficial.jpeg" alt="Pesuas" style="width: 90px !important;margin-bottom: -25px !important;height: auto !important;margin-top: -45px;margin-left: 0;margin-right:0">
                  </div>
              
    
    `;

    dados.forEach((formulario, index) => {

      html += `
      
              <a href="#" onclick="montarFormulario(${formulario.ID})" title="Clique para abrir o formulário">
                        <span>${formulario.title}</span>
                        <i class="fa fa-angle-right"></i>
              </a> 
      
      `;

    });

    
    html +=  `</div></div>`;

    conteudoPrincipal.innerHTML = html;

}

// MONTAR O FORMULÁRIO A PARTIR DO ID
function montarFormulario(idFormulario) {

  var dados = JSON.parse(localStorage.getItem("dadosAPI"));

  let conteudoPrincipal = document.getElementById('conteudoPrincipal');
  let html = '<section class="superform-formulario"><div id="pagepiling">';
  dados.forEach((formulario, index) => {

      if(formulario.ID==idFormulario){
             
             // SALVAR OS DADOS ÚNICOS
             gerarIdentificadorUnico();
             localStorage.setItem("idFormularioAtivo",idFormulario);

              html += `
                  <div class="section sections-paginas section-inicial" id="paginaFormulario${index + 1}">
                      <div class="conteudo">
                          
                          <form method="post" action="javascript:void(0)">
                            ${formulario.conteudo_boas_vindas}
                          </form>
                          
                          <div class="actions">
                              <a href="" onclick="proximaEtapaFormulario()" class="inline-flex px-5 py-3 text-white bg-purple-600 rounded-md mb-3" title="${formulario.texto_botao_de_start}">
                                  ${formulario.texto_botao_de_start}
                              </a>
                          </div>
                          
                          <p style="text-align:center;padding-top:30px;text-decoration:underline;font-size:13px;opacity:0.70" onclick="location.href='index.html'">
                              Voltar ao início
                          </p>

                      </div>
                  </div>
                  
              `;

              formulario.paginas.forEach((pagina, paginaIndex) => {
                  html += `
                      <div class="section sections-paginas" id="paginaFormulario${index + paginaIndex + 2}">
                          <div class="conteudo">
                              ${pagina.conteudo_abertura}
                              <form method="post" action="javascript:void(0)">
                  `;
                  pagina.perguntas.forEach((pergunta, perguntaIndex) => {
                      html += renderizarPergunta(pergunta, index + paginaIndex + 2, perguntaIndex);
                  });
                  html += `
                              </form>
                              <div class="feedback-formulario"></div>
                              <div class="actions">
                                  <a href="" onclick="proximaEtapaFormulario()" class="inline-flex px-5 py-3 text-white bg-purple-600 rounded-md mb-3" title="Próximo">
                                      Próximo
                                  </a>
                              </div>
                          </div>
                      </div>
                  `;
              });

              html += `
                  <div class="section sections-paginas section-encerramento" id="paginaFormularioEncerramento${index}">
                      <div class="conteudo">
                          <form method="post" action="javascript:void(0)">
                          ${formulario.conteudo_conclusao}
                          </form>
                        
                              <div class="actions">
                                  <a href="" onclick="location.reload()"; class="inline-flex px-5 py-3 text-white bg-purple-600 rounded-md mb-3" title="Voltar">
                                      Voltar
                                  </a>
                              </div>
                          ${formulario.url_call_to_action_na_conclusao ? `` : ''}
                      </div>
                  </div>
              `;

    } // IF ID DO FORMULÁRIO


  });
  html += '</div></section>';
  conteudoPrincipal.innerHTML = html;
  iniciarPagePiling();
}

function renderizarPergunta(pergunta, paginaIndex, perguntaIndex) {
  let html = '';
  switch (pergunta.tipo_pergunta_questao) {
      case 'Texto Simples':
          html += `
              <div class="diogenes-form-group">
                  <label for="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}">
                      ${pergunta.titulo_pergunta_questao}
                  </label>
                  <input 
                      type="text" 
                      name="${pergunta.titulo_pergunta_questao}" 
                      id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}" 
                      class="diogenes-form-control" 
                      ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""} 
                      placeholder="">
                  ${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}
              </div>
          `;
          break;
      case 'Texto Longo':
          html += `
              <div class="diogenes-form-group">
                  <label for="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}">
                      ${pergunta.titulo_pergunta_questao}
                  </label>
                  <textarea 
                      rows="6" 
                      name="${pergunta.titulo_pergunta_questao}" 
                      id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}" 
                      class="diogenes-form-control" 
                      ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""} 
                      placeholder=""></textarea>
                  ${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}
              </div>
          `;
          break;
      case 'Endereço de E-mail':
          html += `
              <div class="diogenes-form-group">
                  <label for="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}">
                      ${pergunta.titulo_pergunta_questao}
                  </label>
                  <input 
                      type="email" 
                      name="${pergunta.titulo_pergunta_questao}" 
                      id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}" 
                      class="diogenes-form-control" 
                      ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""} 
                      placeholder="">
                  ${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}
              </div>
          `;
          break;
      case 'Telefone':
          html += `
              <div class="diogenes-form-group">
                  <label for="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}">
                      ${pergunta.titulo_pergunta_questao}
                  </label>
                  <input 
                      type="tel" 
                      name="${pergunta.titulo_pergunta_questao}" 
                      id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}" 
                      class="diogenes-form-control diogenes-telefone" 
                      ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""} 
                      placeholder="">
                  ${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}
              </div>
          `;
          break;
      case 'Celular':
          html += `
              <div class="diogenes-form-group">
                  <label for="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}">
                      ${pergunta.titulo_pergunta_questao}
                  </label>
                  <input 
                      type="tel" 
                      name="${pergunta.titulo_pergunta_questao}" 
                      id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}" 
                      class="diogenes-form-control diogenes-celular" 
                      ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""} 
                      placeholder="">
                  ${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}
              </div>
          `;
          break;
      case 'Data':
          html += `
              <div class="diogenes-form-group">
                  <label for="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}">
                      ${pergunta.titulo_pergunta_questao}
                  </label>
                  <input 
                      type="tel" 
                      name="${pergunta.titulo_pergunta_questao}" 
                      id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}" 
                      class="diogenes-form-control diogenes-data" 
                      ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""} 
                      placeholder="">
                  ${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}
              </div>
          `;
          break;
      case 'CEP':
          html += `
              <div class="diogenes-form-group">
                  <label for="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}">
                      ${pergunta.titulo_pergunta_questao}
                  </label>
                  <input 
                      type="tel" 
                      name="${pergunta.titulo_pergunta_questao}" 
                      id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}" 
                      class="diogenes-form-control diogenes-cep" 
                      ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""} 
                      placeholder="">
                  ${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}
              </div>
          `;
          break;
      case 'CPF':
          html += `
              <div class="diogenes-form-group">
                  <label for="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}">
                      ${pergunta.titulo_pergunta_questao}
                  </label>
                  <input 
                      type="tel" 
                      name="${pergunta.titulo_pergunta_questao}" 
                      id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}" 
                      class="diogenes-form-control diogenes-cpf" 
                      ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""} 
                      placeholder="">
                  ${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}
              </div>
          `;
          break;
      case 'CNPJ':
          html += `
              <div class="diogenes-form-group">
                  <label for="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}">
                      ${pergunta.titulo_pergunta_questao}
                  </label>
                  <input 
                      type="tel" 
                      name="${pergunta.titulo_pergunta_questao}" 
                      id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}" 
                      class="diogenes-form-control diogenes-cnpj" 
                      ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""} 
                      placeholder="">
                  ${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}
              </div>
          `;
          break;
      case 'Checkbox':
          html += `<p><b>${pergunta.titulo_pergunta_questao}</b></p>`;
          let opcoesCheckbox = pergunta.opcoes_pergunta_questao.split('|');
          html += '<div class="diogenes-row">';
          opcoesCheckbox.forEach((opcao, opcaoIndex) => {
              html += `
                  <div class="diogenes-form-group diogenes-col-xl-6 diogenes-col-lg-6 diogenes-col-12">
                      <input 
                          id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}Alternativa${opcaoIndex}" 
                          name="${pergunta.titulo_pergunta_questao}" 
                          type="checkbox" 
                          ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""} 
                          value="${opcao}" 
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                      <label for="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}Alternativa${opcaoIndex}">
                          ${opcao}
                      </label>
                  </div>
              `;
          });
          html += `${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}`;
          html += '</div>';
          break;
      case 'Lista de Opções':
          html += `<p><b>${pergunta.titulo_pergunta_questao}</b></p>`;
          let opcoesSelect = pergunta.opcoes_pergunta_questao.split('|');
          html += `<select
                      id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}" 
                      name="${pergunta.titulo_pergunta_questao}" 
                      ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""}
                      class="diogenes-form-control"
                  >
                      <option value="">Selecione uma opção</option>`;
          opcoesSelect.forEach(opcao => {
              html += `<option value="${opcao}">${opcao}</option>`;
          });
          html += `</select>
                  ${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}`;
          break;
      case 'Radios':
          html += `<p><b>${pergunta.titulo_pergunta_questao}</b></p>`;
          let opcoesRadio = pergunta.opcoes_pergunta_questao.split('|');
          html += '<div class="diogenes-row">';
          opcoesRadio.forEach((opcao, opcaoIndex) => {
              html += `
                  <div class="diogenes-form-group diogenes-col-xl-6 diogenes-col-lg-6 diogenes-col-12">
                      <input 
                          id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}Alternativa${opcaoIndex}" 
                          type="radio" 
                          name="${pergunta.titulo_pergunta_questao}" 
                          ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""} 
                          value="${opcao}" 
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                      <label for="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}Alternativa${opcaoIndex}">
                          ${opcao}
                      </label>
                  </div>
              `;
          });
          html += `${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}`;
          html += '</div>';
          break;
      case 'Radios especiais':
          html += `<p><b>${pergunta.titulo_pergunta_questao}</b></p>`;
          let opcoesRadiosEspeciais = pergunta.opcoes_pergunta_questao.split('|');
          html += '<ul class="grid w-full gap-6 md:grid-cols-2">';
          opcoesRadiosEspeciais.forEach((opcao, opcaoIndex) => {
              let especiais = opcao.split('#');
              html += `
                  <li>
                      <input 
                          type="radio" 
                          id="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}Alternativa${opcaoIndex}" 
                          name="${pergunta.titulo_pergunta_questao}" 
                          value="${especiais[0]}" 
                          class="hidden peer" 
                          ${pergunta.campo_obrigatorio === "Sim" ? "required" : ""}>
                      <label 
                          for="perguntaPagina${paginaIndex}Pergunta${perguntaIndex}Alternativa${opcaoIndex}" 
                          class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                          <div class="block">
                              <div class="w-full text-lg font-semibold">${especiais[0]}</div>
                              <div class="w-full" style="font-weight:normal !important;">${especiais[1]}</div>
                          </div>
                          <svg aria-hidden="true" class="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                      </label>
                  </li>
              `;
          });
          html += '</ul>';
          html += `${pergunta.texto_de_apoio_pergunta_questao ? `
                      <p class="helper-radio-text text-xs font-normal text-gray-500 dark:text-gray-300">
                          ${pergunta.texto_de_apoio_pergunta_questao}
                      </p>
                  ` : ''}`;
          break;
      default:
          break;
  }
  return html;
}

function iniciarPagePiling() {
  jQuery('#pagepiling').pagepiling({
      menu: null,
      direction: 'vertical', 
      verticalCentered: true,
      sectionsColor: [],
      anchors: [],
      scrollingSpeed: 900,
      easing: 'swing',
      loopBottom: false,
      loopTop: false,
      css3: true,
      navigation: false,
      normalScrollElements: false,
      normalScrollElementTouchThreshold: 5,
      touchSensitivity: 5,
      keyboardScrolling: false,
      sectionSelector: '.section',
      animateAnchor: false,
      onLeave: function(index, nextIndex, direction) {
          if(parseInt(index) == parseInt(jQuery(".sections-paginas").length - 1)) {
              dispararNotificacoes();
          }
          setTimeout(function() {
              jQuery(".diogenes-celular").inputmask("(99) 9 9999-9999");
              jQuery(".diogenes-telefone").inputmask("(99) 9999-9999");
              jQuery(".diogenes-cep").inputmask("99999-999");
              jQuery(".diogenes-cpf").inputmask("999.999.999.99");
              jQuery(".diogenes-cnpj").inputmask("99.999.999/9999-99");
              jQuery(".diogenes-data").inputmask("99/99/9999");
          }, 1000);
      },
      afterLoad: function(anchorLink, index) {},
      afterRender: function() {
        $.fn.pagepiling.setAllowScrolling(false); // Desabilita a rolagem
    }
  });
}

function proximaEtapaFormulario() {
  
  let form = jQuery(`#paginaFormulario${posicaoAtualFormulario} form`)[0];
  if(!form){
    tudoCerto();
  }else{

    if (form.checkValidity()) {
        let formData = jQuery(form).serialize();
        tudoCerto(formData);
    } else {
        algoErrado();
        form.reportValidity();
    }

  }
  
      
}

function proximo() {
  posicaoAtualFormulario++;
  jQuery.fn.pagepiling.moveSectionDown();

  $(document).ready(function() {
    // Força a div com ID 'minhaDiv' a rolar para a posição 0
    $('*').scrollTop(0);
});
}


function gerarIdentificadorUnico() {
   var codigoUnicoForm = Math.floor(100000 + Math.random() * 900000).toString();
   localStorage.setItem("codigoUnico",codigoUnicoForm);
}

function obterIdentificadorUnico() {
  return localStorage.getItem("codigoUnico"); // Retorna um valor padrão caso não exista
}

function obterIdFormularioAtivo() {
  return localStorage.getItem("idFormularioAtivo"); // Retorna um valor padrão caso não exista
}


function dispararNotificacoes() {

  if (navigator.onLine) {

      var identificadorUnico = obterIdentificadorUnico();
      var idFormulario       = obterIdFormularioAtivo();

      var params = "action=notificacao_super_formulario&identificador=" + identificadorUnico + "&id=" + idFormulario;
      jQuery.ajax({
          url: superFormHomeUrl + "/wp-admin/admin-ajax.php",
          type: "POST",
          dataType: "json",
          data: params,
          success: function(data) {
              try {
                  eval(data.track);
              } catch(e) {
                  console.error("Erro na execução do script: ", e);
              }
          }
      });

  }else{

      console.log("Usuário não está online para envio das informações");

  }


}

function tudoCerto(formData) {

      if (navigator.onLine) {
          
              var identificadorUnico = obterIdentificadorUnico();
              var idFormulario       = obterIdFormularioAtivo();

              var params = "action=salvar_dados_super_formulario&identificador=" + identificadorUnico + "&id=" + idFormulario + "&" + formData;
              jQuery.ajax({
                  url: superFormHomeUrl + "/wp-admin/admin-ajax.php",
                  type: "POST",
                  dataType: "json",
                  data: params,
                  success: function(data) {
                      if (data.sucesso == 200) {
                          console.log("SOLICITAÇÃO ENVIADA COM SUCESSO! INDO PARA O PRÓXIMO PASSO...");
                      } else {
                          algoErrado();
                          return false;
                      }
                  }
              });

      }else{

          console.log("Usuário não está online para envio das informações");
          armazenarDadosOffline(formData,identificadorUnico, idFormulario);

      }

      proximo();

}

function armazenarDadosOffline(formData,identificadorUnico, idFormulario) {
  let pendentes = JSON.parse(localStorage.getItem("dadosPendentes")) || [];
  pendentes.push({ formData, identificadorUnico, idFormulario });
  localStorage.setItem("dadosPendentes", JSON.stringify(pendentes));
}

function enviarDadosPendentes() {

      // APRESENTAR NO HTML ATIVAMENTE QUE ESTAMOS SINCRONIZANDO DADOS
     

      if (navigator.onLine) {
          let pendentes = JSON.parse(localStorage.getItem("dadosPendentes")) || [];
          
          if (pendentes.length > 0) {
              console.log("Enviando dados pendentes...");

              pendentes.forEach((item, index) => {
                  // Extrair valores de item
                  const { formData, identificadorUnico, idFormulario } = item;
                  enviarDados(formData, identificadorUnico, idFormulario);

                  // Remover o item enviado da lista de pendentes
                  pendentes.splice(index, 1);
              });

              // Atualizar o localStorage após enviar todos os dados
              localStorage.setItem("dadosPendentes", JSON.stringify(pendentes));
          }

          // Após enviar todos os dados, limpar o localStorage
          localStorage.removeItem("dadosPendentes");
          console.log("Todos os dados pendentes foram enviados e removidos do armazenamento.");

      }

      setTimeout(function(){
        jQuery("#feedbackSincDados").html(` `);
      }, 20000);
}



function enviarDados(formData, identificadorUnico, idFormulario) {
  var params = "action=salvar_dados_super_formulario&identificador=" + identificadorUnico + "&id=" + idFormulario + "&" + formData;

  jQuery.ajax({
      url: superFormHomeUrl + "/wp-admin/admin-ajax.php",
      type: "POST",
      dataType: "json",
      data: params,
      success: function(data) {
          if (data.sucesso == 200) {
              console.log("SOLICITAÇÃO ENVIADA COM SUCESSO! INDO PARA O PRÓXIMO PASSO...");
              // Se necessário, você pode remover dados pendentes aqui ou registrar o sucesso em outro lugar
          } else {
              algoErrado();
              // Armazena dados novamente caso falhe
              armazenarDadosOffline(formData, identificadorUnico, idFormulario);
          }
      },
      error: function() {
          console.log("Erro na solicitação AJAX, armazenando dados para envio futuro.");
          // Armazena dados novamente em caso de erro na solicitação
          armazenarDadosOffline(formData, identificadorUnico, idFormulario);
      }
  });
}









function algoErrado() {
  jQuery(`#paginaFormulario${posicaoAtualFormulario} .feedback-formulario`).html(`
      <div class="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md" role="alert" style="max-width:100%;border-radius:8px;">
          <div class="flex">
              <div>
                  <h3 class="text-red-700" style="margin-bottom:0">Oops! Algo deu errado.</h3>
                  <p class="text-sm">Verifique as informações inseridas e tente novamente.</p>
              </div>
          </div>
      </div>
  `);

  setTimeout(function(){
      jQuery(`#paginaFormulario${posicaoAtualFormulario} .feedback-formulario`).fadeOut(500);
  }, 3500);
  setTimeout(function(){
      jQuery(`#paginaFormulario${posicaoAtualFormulario} .feedback-formulario`).html(` `);
  }, 4000);
  setTimeout(function(){
      jQuery(`#paginaFormulario${posicaoAtualFormulario} .feedback-formulario`).fadeIn(500);
  }, 4150);
}












function confirmacaoPreSaque(maxVal=0){

      var valor_saque = prompt("Qual valor deseja sacar? (Valor máximo de R$"+maxVal.toFixed(2)+")");

      // CONVERTER PARA FLOAT
      valor_saque = parseFloat(valor_saque);

      if(valor_saque>maxVal){
        alert("O valor é superior ao seu saldo disponível");
        return;
      }

      var idVendedorLogado = localStorage.getItem("idVendedorLogado");
      var vendedorChavePix = localStorage.getItem("vendedorChavePix");
      var vendedorTitularPix = localStorage.getItem("vendedorTitularPix");
      var vendedorTipoChavePix = localStorage.getItem("vendedorTipoChavePix");
      var vendedorCpfTitularPix = localStorage.getItem("vendedorCpfTitularPix");

      if(vendedorChavePix=="" || vendedorChavePix==null){
         location.href="dados-bancarios.html";
         return;
      }

      // EXIBIR O ALERTA DE CARREGANDO
      var toastID = document.getElementById('toast-carregando');
      toastID = new bootstrap.Toast(toastID);
      toastID.show();

      app.models.enviarSaque(valor_saque);
      
      //this.models.salvarMeusDados(form);
      setTimeout(function(){ 
          document.getElementById('sucessoEnvioMsg').click(); 
      }, 5000);

      setTimeout(function(){ 
        location.reload();
    }, 8000);

}



// PESQUISA
function pesquisa(){

    var inputPesquisa = document.querySelector('.search-box input[type="text"]');
    var divResultados = document.querySelector('.search-results');
    var listaContatos = document.getElementById('listaContatosPesquisa');
  
    inputPesquisa.addEventListener('input', function() {
        var textoPesquisa = inputPesquisa.value.toLowerCase();
  
        // Ativar ou desativar a lista de resultados
        if (textoPesquisa === '') {
            divResultados.classList.add('disabled-search-list');
        } else {
            divResultados.classList.remove('disabled-search-list');
        }
  
        // Filtrar itens
        var itens = listaContatos.querySelectorAll('.col-6');
        var itemVisivel = false;
  
        itens.forEach(function(item) {
            var nomeItem = item.getAttribute('data-filter-name').toLowerCase();
            if (nomeItem.includes(textoPesquisa)) {
                item.style.display = '';
                itemVisivel = true;
            } else {
                item.style.display = 'none';
            }
        });
  
        // Mostrar ou ocultar mensagem de 'nenhum resultado'
        var divSemResultados = document.querySelector('.search-no-results');
        if (itemVisivel) {
            divSemResultados.classList.add('disabled');
        } else {
            divSemResultados.classList.remove('disabled');
        }
    });
 

}

function compartilharTexto(texto) {
  var mensagem = texto;
  
  // Chama o método de compartilhamento
  window.plugins.socialsharing.share(mensagem, null, null, null,
      function(success) {
          console.log('Compartilhamento bem-sucedido');
      }, function(error) {
          console.log('Erro ao compartilhar: ' + error);
      }
  );
}



function copiarCodigo(seletor){

  var copyTextarea = document.querySelector(seletor);
  copyTextarea.focus();
  copyTextarea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log("Copiado");
    alert("CÓDIGO COPIADO!");
  } catch (err) {
    console.log('Oops, unable to copy');
  }

}

function preContatos(opcao){

        jQuery(".carregando-contatos").show();
        jQuery("#listaContatosListagem").html(` `);

        setTimeout(function(){
          app.models.getContatos();
        }, 5000);

        const labels = ["Julho","Agosto","Setembro","Outubro","Novembro","Dezembro","Janeiro"];
        const data = {
          labels: labels,
          datasets: [{
            label: 'Sua performance de vendas no período',
            data: [0, 0, 0, 0, 0, 0, parseInt(localStorage.getItem("totVendasVendedorParaGrafico"))],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        };

        const config = {
          type: 'line',
          data: data,
        };

        const ctx = document.getElementById('myChart');
        
        setTimeout(function(){
          new Chart(ctx, config);
        }, 10000);

}



function enviarCobrancaPix(form){

    // SERIALIZAR O FORMULARIO PARA ENVIAR PARA O SERVIDOR
    var data = $(form).serializeArray();

    var contato = $("#form1").val();
    var whatsapp = $("#form1ac").val();
    var valor = $("#form2").val();
    var chave = $("#form22").val();

     // INICIO CHAMADA AJAX
     var request = $.ajax({

      method: "POST",
      url: "https://diogenesjunior.com.br/api/enviarmsg",
      data:{contato:contato,whatsapp:whatsapp,valor:valor,chavepix:chave},
  
  })
  request.done(function (dados) {        

     
      console.log("%c RETORNO DO ENVIO","background:#ff0000;color:#fff;");
      console.log(dados);

     
      $("#menu-success-2").fadeIn();
      $("#menu-success-2").css("opacity","1");

      // ATUALIZAR A PAGINA DEPOIS DE 5 SEGUNDOS
      setTimeout(function(){
        location.reload();
      } , 5000);

  });
  request.fail(function (dados) {

       console.log("API NÃO DISPONÍVEL (procLogin)");
       console.log(dados);
       aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

  });
  // FINAL CHAMADA AJAX


}

function fecharAvisoModal(){

      $("#menu-success-2").fadeOut();
      $("#menu-success-2").css("opacity","0");

}


// MAPA

// VARIAVEIS GLOBAIS DO MAPA
var input;
var map;
var directionsDisplay; // Instanciaremos ele mais tarde, que será o nosso google.maps.DirectionsRenderer


// SETAR AS COORDANADAS PADRÃO CASO NÃO AS TENHAMOS
var pscLat = "-23.5667005";
var pscLon = "-46.6531514";


// INICIALIZAR GEOLOCATION
function initGeolocation(){

      if( navigator.geolocation )
       {
          // Call getCurrentPosition with success and failure callbacks
          navigator.geolocation.getCurrentPosition( success, fail );
       }
       else
       {
          aviso("Sem GPS","Não conseguimos acessar o seu GPS. Mas não se preocupe, você poderá utilizar o aplicativo mesmo assim.");
       }
       function success(position)
            {
                var cordenadas = "";
                cordenadas = position.coords.longitude;
                cordenadas = cordenadas+", ";
                cordenadas = cordenadas + position.coords.latitude;
                // SETAR AS NOVAS COORDENADAS
                pscLat = position.coords.latitude;
                pscLon = position.coords.longitude;

                console.log("LAT NEW: "+pscLat);
                console.log("LON NEW: "+pscLon);

                // SALVAR NA MEMORIA A POSIÇÃO ATUAL DO USUARIO
                if(pscLat!="" && pscLon!=""){
                  localStorage.setItem("latitude",pscLat);
                  localStorage.setItem("longitude",pscLon);
                }

                // SE TIVERMOS A LOCALIZAÇÃO ATUAL, A GENTE COMEÇA A EXIBIR O MAPA A PARTIR DESSE PONTO
                if(pscLat!="" && pscLon!=""){

                    console.log("Coordenadas foram obtidas sem maiores problemas.");
                    carregarMapa();

                }else{

                   aviso("Problemas com o GPS","Conseguimos obter os dados do seu GPS, mas os mesmos não estão no formato esperado. Mas não se preocupe, você poderá utilizar o aplicativo mesmo assim.");
                   carregarMapa();
                }


            }
          function fail()
            {
               aviso("Sem GPS","Não conseguimos acessar o seu GPS, por causa de um problema de permissões no disposítivo. Mas não se preocupe, você poderá utilizar o aplicativo mesmo assim.");
               carregarMapa();
            }


}



function initMapa(){

   console.log("INICIANDO FUNÇÃO PARA GERAR O MAPA GOOGLEMAPS");
   console.log("%c NESSA FUNÇÃO VAMOS INICIAR O AUTOCOMPLETE","background:#ff0000;color:#fff;");
   
   // AUTO COMPLETO DO ENDEREÇO
   input = document.getElementById('destino');
   var autoComplete = new google.maps.places.Autocomplete(input);

   var directionsService = new google.maps.DirectionsService();
   google.maps.event.addDomListener(window, 'load', autoComplete);

  localStorage.setItem("latitude",pscLat);
  localStorage.setItem("longitude",pscLon);

  initGeolocation();


}


function carregarMapa(){

         directionsDisplay = new google.maps.DirectionsRenderer(); // Instanciando...

          pscLat = localStorage.getItem("latitude");
          pscLon = localStorage.getItem("longitude");

           var latlng = new google.maps.LatLng(pscLat, pscLon);

           var options = {
              zoom: 15,
              center: latlng,
              scrollwheel: false,
              disableDefaultUI: true,
              draggable: true,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              styles: [
              {
                "featureType": "administrative.neighborhood",
                "elementType": "labels",
                "stylers": [{
                  "visibility": "off"
                }]
              }, {
                "featureType": "administrative.land_parcel",
                "elementType": "labels",
                "stylers": [{
                  "visibility": "off"
                }]
              }, {
                "featureType": "administrative.locality",
                "elementType": "labels",
                "stylers": [{
                  "visibility": "off"
                }]
              },
                  {
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#f5f5f5"
                      }
                    ]
                  },
                  {
                    "elementType": "labels.icon",
                    "stylers": [
                      {
                        "visibility": "off"
                      }
                    ]
                  },
                  {
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#616161"
                      }
                    ]
                  },
                  {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                      {
                        "color": "#f5f5f5"
                      }
                    ]
                  },
                  {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#bdbdbd"
                      }
                    ]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#eeeeee"
                      }
                    ]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#757575"
                      }
                    ]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#e5e5e5"
                      }
                    ]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#9e9e9e"
                      }
                    ]
                  },
                  {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#ffffff"
                      }
                    ]
                  },
                  {
                    "featureType": "road.arterial",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#757575"
                      }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#dadada"
                      }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#616161"
                      }
                    ]
                  },
                  {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#9e9e9e"
                      }
                    ]
                  },
                  {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#e5e5e5"
                      }
                    ]
                  },
                  {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#eeeeee"
                      }
                    ]
                  },
                  {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#c9c9c9"
                      }
                    ]
                  },
                  {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      {
                        "color": "#9e9e9e"
                      }
                    ]
                  }
                ]
           };


           map = new google.maps.Map(document.getElementById("mapa"), options);
           directionsDisplay.setMap(map); // Relacionamos o directionsDisplay com o mapa desejado
               
               // #### NÃO VAMOS PRECISAR DE MARCADOR AQUI
               /*
               var image = {
                 url: 'images/gps.svg',
                  size: new google.maps.Size(40, 60),
                  origin: new google.maps.Point(0,0),
                  anchor: new google.maps.Point(40, 24)
                };

                var marker = new google.maps.Marker({
                    icon: image,
                    position: latlng,
                    map: map,
                });

                google.maps.event.addListener(marker,'click',function(){
                    aviso('O que significa esse ícone?','Segundo o seu GPS, essa é a sua localização atual');
                });
                */



}


        // APÓS O CLICK EM UM LOCAL, VAMOS APAGAR O MAPA, E FAZER APARECER A SELEÇÃO DO TIPO DE TREINO
        $("#destino").change(function(){

               // FAZER APARECER NA TELA A DIV PARA SALVAR O DESTINO
               console.log("DESTINO ESCOLHIDO");

               //var destinoEscolhido = $("#destino").val();

               //$("#mapa").fadeOut("250");
               //console.log("DESTINO ESCOLHIDO: "+destinoEscolhido);
               //localStorage.setItem("destinoViagemPrimario",destinoEscolhido);

               // ALIMENTAR SELEÇÃO
               //$("#enderecoDaSelecao").html('<li><a href="javascript:void(0)" title="Sugestão de endereço"><img src="images/sugestao.svg" alt="Sugestão de endereço"> '+destinoEscolhido+'</a></li>');


        });


        $("body .pac-container").click(function(){
          
          console.log("CLICOU NO PAC");

        });

        // CORREÇÃO PARA SELEÇÃO DO DESTINO ONMOBILE
        $(document).on({
            'DOMNodeInserted': function() {

                $('.pac-item, .pac-item span', this).addClass('no-fastclick');
                //$(".tepping-flex").fadeOut("250");
                //$(".caixa-sugestoes-treinos").fadeOut();
                console.log("PAC GOOGLE: ");

                $( ".pac-item, .pac-item" ).each(function( index ) {
                  if($(this).html()!=""){
                     $("#enderecoDaSelecao").append('<li><a href="" title="Sugestão de endereço" onclick="salvarEnderecoFinalmente(this)"><img src="assets/images/sugestao.svg" alt="Sugestão de endereço">'+$(this).html()+'</a></li>');
                  }
                });
                
                //var text = $('.pac-item, .pac-item').html();
                
                
                // TESTES FUNÇÕES DE ALIMENTAÇÃO DO PAC AUTO COMPLET DO GOOGLE
                //var destinoEscolhido = $("#destino").val();
                //console.log("DESTINO ESCOLHIDO: "+destinoEscolhido);
                //localStorage.setItem("destinoViagemPrimario",destinoEscolhido);

                // ALIMENTAR SELEÇÃO
                //$("#enderecoDaSelecao").html('<li><a href="javascript:void(0)" title="Sugestão de endereço"><img src="images/sugestao.svg" alt="Sugestão de endereço"> '+destinoEscolhido+'</a></li>');



            }
        }, '.pac-container');



















            // COMO FAZER A CHAMADA NO FORMULÁRIO onSubmit="return ajaxSubmit(this);"
            var ajaxSubmit = function(form) {
                // fetch where we want to submit the form to
                var url = $(form).attr('action');
                var flag = 9;

                var data = $(form).serializeArray();

                // setup the ajax request
                $.ajax({
                    url: url,
                    data: data,
                    dataType: 'json',
                    type:'POST'
                });

                swal("Obrigado!", 'Sua mensagem foi enviada com sucesso', "success");

                return false;
            }


          // FOR"CAR VOLTAR AO TOPO
          function voltarAoTopo(){
            
            var objDiv = document.getElementById("content");
            objDiv.scrollTop = 0;

          }



          function removerBackground(){

                $("body").css("background","transparent");
                $("section#content").css("background","transparent");
                $("section#content").css("opacity","0");

           }
           
           function restaurarBackground(){

                $("body").css("background","#F8F8F8");
                $("section#content").css("background","#F8F8F8");
                $("section#content").css("opacity","1");

                $(".take-a-picture").css("bottom","-1000%");

           }

            

          // SE O USUÁRIO FIZER UM GESTURE PARA A PARTE INFERIOR DA PÁGINA
          // VAMOS FECHAR A LAYER DO CARRO, CASO ELA ESTEJA ABERTA

          $("#swipeAviso").swipe({
            swipe:function(event, direction, distance, duration, fingerCount) {

              if(direction=="down"){

                $(".modal-avisos .aviso").css("bottom","-300%");
                $(".modal-avisos").fadeOut(500);

              }

            }
          });
          
          $("#swipemeConfirmacao").swipe({
            swipe:function(event, direction, distance, duration, fingerCount) {

              if(direction=="down"){

                $(".modal-confirmacao .confirmacao").css("bottom","-300%");
                $(".modal-confirmacao").fadeOut(500);

              }

            }
          });

          $("#swipeAcoes").swipe({
            swipe:function(event, direction, distance, duration, fingerCount) {

              if(direction=="down"){

                $(".modal-acoes .aviso").css("bottom","-300%");
                $(".modal-acoes").fadeOut(500);

              }

            }
          });
          



            /* FUNÇÃO GERAL PARA EXIBIR OS AVISOS DO PÁGINA */
            function aviso(titulo,mensagem){

              console.log("%c COMEÇANDO FUNÇÃO PARA EXIBIR AVISO","background:#ff0000;color:#fff;");
              $(".modal-avisos").fadeIn(100);

              $(".modal-avisos .aviso").css("bottom","0");


              // ALIMENTAR O HTML
              $(".modal-avisos .aviso h3").html(titulo);
              $(".modal-avisos .aviso p").html(mensagem+'<p style="padding-top:12px;padding-left:0px;"><button type="button" onclick="fecharAviso();" class="btn btn-primary">Ok</button></p>');
              
              //setTimeout("fecharAviso()",12000);


            }
            function fecharAviso(){
              
              $(".modal-avisos .aviso").css("bottom","-300%");
              $(".modal-avisos").fadeOut(500);

            }

            /* FUNÇÃO GERAL PARA EXIBIR CONFIRMAÇÕES DE AÇÕES */
            function confirmacao(titulo,mensagem,funcaoConfirmacao,textoConfirmacao){

              console.log("%c COMEÇANDO FUNÇÃO PARA EXIBIR AVISO","background:#ff0000;color:#fff;");
              $(".modal-confirmacao").fadeIn(100);

              $(".modal-confirmacao .confirmacao").css("bottom","0");

              // ALIMENTAR O HTML
              $(".confirmacao h3").html(titulo);
              $(".confirmacao p").html(mensagem);

              $(".confirmacao #acaoConfirmacao").attr("onclick",funcaoConfirmacao+"; fecharConfirmacao();");
              if(textoConfirmacao!=""){
                $(".confirmacao #acaoConfirmacao").html(textoConfirmacao);
              }
              

            }
            function fecharConfirmacao(){

                 $(".modal-confirmacao .confirmacao").css("bottom","-300%");
                 $(".modal-confirmacao").fadeOut(500);

            }

            // FUNÇÃO PARA FECHAR MODAL DE AÇÕES SOBRE POSTAGEM
            function fecharAcoes(){
              
              $(".modal-acoes .aviso").css("bottom","-300%");
              $(".modal-acoes").fadeOut(500);

            }


// RETORNAR A DATA ATUAL
function queDiaEHoje(){
   
  var currentdate = new Date(); 
  var datetime = "Hoje é: " + currentdate.getDate() + "/"
                  + (currentdate.getMonth()+1)  + "/" 
                  + currentdate.getFullYear() + " | "  
                  + currentdate.getHours() + ":"  
                  + currentdate.getMinutes() + ":" 
                  + currentdate.getSeconds();

  return datetime;

}




// FORMULARIO FLUTUANTE onclick="ativarFormularioFlutuante('','')"
function ativarFormularioFlutuante(campoParaPreenchimento,labelPreenchimento){

   $(".input-flutuante-acessibilidade").fadeIn(500);
   //$(".barra-navegacao").hide(0);

   $("#fieldInputFlutuante").val($(campoParaPreenchimento).val());

   localStorage.setItem("campoParaPreenchimento",campoParaPreenchimento);

   $("#fieldInputFlutuante").focus();
   $('.input-flutuante-acessibilidade label').html(labelPreenchimento);

}

function validarFormularioFlutuante(event){

    event.preventDefault();

    var fieldInputFlutuante = $("#fieldInputFlutuante").val();
    
    $(".input-flutuante-acessibilidade").fadeOut(500);
    //$(".barra-navegacao").show(0);

    $(localStorage.getItem("campoParaPreenchimento")).val(fieldInputFlutuante);

}

// GARANTIR O FECHAMENTO DO CAMPO QUANDO A TELA VOLTAR AO NORMAL
$(document).ready(function() {
  var _originalSize = $(window).width() + $(window).height()
  $(window).resize(function() {
    if ($(window).width() + $(window).height() == _originalSize) {
      console.log("keyboard active "+_originalSize);
      $(".input-flutuante-acessibilidade").fadeOut(500);
      //$(".barra-navegacao").show(0);
    }
  });
});


/* FUNÇÃO PARA COMPARTILHAMENTO EXTERNO */
function compartilhar(){
  

                  // this is the complete list of currently supported params you can pass to the plugin (all optional)
                  var options = {
                    message: 'Rede Social Agroh', // not supported on some apps (Facebook, Instagram)
                    subject: 'A rede social do Agronegócio', // fi. for email
                    //files: ['', ''], // an array of filenames either locally or remotely
                    url: 'https://www.agroh.com.br',
                    chooserTitle: 'Agroh', // Android only, you can override the default share sheet title
                    //appPackageName: 'com.apple.social.facebook', // Android only, you can provide id of the App you want to share with
                    //iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
                  };

                  var onSuccess = function(result) {
                    console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                    console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                  };

                  var onError = function(msg) {
                    console.log("Sharing failed with message: " + msg);
                  };

                  window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);


}


   

     // CODIGOS PARA UPLOAD DE ARQUIVOS LOCAIS
     function uploadLocal(){

         console.log("ENTRAMOS!");
         //var files = $(this)[0].files;

         $(".retorno-upload").css("padding-bottom","24px");

         $(".retorno-upload").html(`<img src="assets/images/loading.gif" style="width:32px;height:auto;"> Estamos enviando suas imagens, aguarde.`);
         
         /* Efetua o Upload 
         $('.fileForm').ajaxForm({
          dataType:  'json',
          success:   processJson 
         }).submit();
         */

     }
     function processJson(dados) { 

            // 'data' is the json object returned from the server 
            console.log("%c RETORNO SOBRE O ENVIO DAS IMAGENS (UPLOAD):","background:#ff0000;color:#fff;");
            console.log(dados); 
            
            if(dados.erros===null){
            
              console.log("NENHUM ERRO!");
              $(".retorno-upload").html(`<i class="fa fa-check"></i> Imagem enviada com sucesso!`);

              // LIMPAR A SESSAO
              $(".card").html("");

              $(".card").append(`

                           <div class="caixa-preview-imagem-carregada" data-id="${0}" data-url="${dados.dados[0].url}" id="caixaPreviewImagemCarregada${0}">
                              <div style="margin-left:auto;margin-right:auto;position:relative;display:block;width:100px;height:100px;border-radius:8px;background:url('${app.urlCdn}${dados.dados[0].url}') #f2f2f2 no-repeat;background-size:cover;background-position:center center;">
                                  &nbsp;
                              </div>
                              <p>
                                <a href="" onclick="app.views.removerImagemGaleriaImagens(${0})" title="Remover essa imagem" style="font-size:13px;color:#ff0000;">
                                  <i class="fa fa-times"></i> remover
                              </a>
                              </p>
                           </div>

              `);  

              $("#imagemOculta").val(dados.dados[0].url);
              $("#tipoImagem").val("batch");


            }else{
              
              $(".retorno-upload").html('<div class="alert alert-danger">'+dados.erros+'</div>');              

            }

            $('.fileForm').resetForm();

        }
      // CODIGOS PARA UPLOAD DE ARQUIVOS LOCAIS















