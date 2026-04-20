export interface Unit {
    name: string;
    address: string;
    cep?: string;
    type: 'Própria' | 'Parceria';
    region: string;
}

export const units: Unit[] = [
    // Unidades em São Paulo (Capital e Região Metropolitana)
    { region: 'São Paulo (Capital e RM)', name: 'Alphaville (SP)', address: 'Alameda Rio Negro, 503, Sala 2020, Barueri', cep: '06454-000', type: 'Própria' },
    { region: 'São Paulo (Capital e RM)', name: 'Berrini 1 (SP)', address: 'Rua André Ampere, 153-159, São Paulo', cep: '04562-080', type: 'Parceria' },
    { region: 'São Paulo (Capital e RM)', name: 'Berrini 2 (SP)', address: 'Av. Engenheiro Luís Carlos Berrini, 1710 e 1748, Sala 1710, São Paulo', cep: '04571-000', type: 'Própria' },
    { region: 'São Paulo (Capital e RM)', name: 'Faria Lima 1 (SP)', address: 'Av. Brigadeiro Faria Lima, 2369, Salas 1102 e 1103, São Paulo', cep: '01452-000', type: 'Própria' },
    { region: 'São Paulo (Capital e RM)', name: 'Faria Lima 2 (SP)', address: 'Av. Brigadeiro Faria Lima, 1811, Salas 1119 e 1120, São Paulo', cep: '01452-001', type: 'Própria' },
    { region: 'São Paulo (Capital e RM)', name: 'Guarulhos (SP)', address: 'Av. Salgado Filho, 2120 e 2150, Sala 2112, Torre C', cep: '07115-000', type: 'Própria' },
    { region: 'São Paulo (Capital e RM)', name: 'Osasco (SP)', address: 'Av. dos Autonomistas, 896, Bloco Santorini, cj. 1209', cep: '06.020-010', type: 'Parceria' },
    { region: 'São Paulo (Capital e RM)', name: 'Paulista 1 (SP)', address: 'Avenida Paulista, 171, 4° andar, Bela Vista, São Paulo', cep: '01311-904', type: 'Própria' },
    { region: 'São Paulo (Capital e RM)', name: 'Paulista 2 (SP)', address: 'Avenida Paulista, 1636, Sala 1504, Cerqueira Cesar, São Paulo', cep: '01310-200', type: 'Própria' },
    { region: 'São Paulo (Capital e RM)', name: 'Paulista 4 (SP)', address: 'Av. Paulista, 91, conjunto 905, São Paulo', cep: '01311-000', type: 'Própria' },
    { region: 'São Paulo (Capital e RM)', name: 'Tatuapé (SP)', address: 'Rua Serra de Botucatu, 880, Sala 1503, São Paulo', cep: '03317-000', type: 'Própria' },
    { region: 'São Paulo (Capital e RM)', name: 'Vila Leopoldina (SP)', address: 'Av. Mofarrej, 348, Salas 1308 e 1309', cep: '05311-000', type: 'Própria' },
    
    // Unidades no Interior de São Paulo
    { region: 'Interior de São Paulo', name: 'Assis (SP)', address: 'Rua Mauri Torreti, 60', cep: '19807-466', type: 'Parceria' },
    { region: 'Interior de São Paulo', name: 'Campinas (SP)', address: 'Av. José de Souza Campos, 1073, Sala 1207, Cambuí', cep: '13025-320', type: 'Própria' },
    { region: 'Interior de São Paulo', name: 'Jundiaí (SP)', address: 'Rua Anchieta, 204, Vila Boaventura, Sala 102 e 107', cep: '13.201-804', type: 'Parceria' },
    { region: 'Interior de São Paulo', name: 'Ribeirão Preto (SP) - Unidade 1', address: 'Rua Ayrton Roxo, 901, Alto da Boa Vista', cep: '14.025-270', type: 'Parceria' },
    { region: 'Interior de São Paulo', name: 'Ribeirão Preto (SP) - Unidade 2', address: 'Av. Dr. Plínio de Castro Prado, 288, Sala 23', cep: '14091-170', type: 'Própria' },
    { region: 'Interior de São Paulo', name: 'Santos (SP)', address: 'Av. Ana Costa, 61, Térreo, Gonzaga', cep: '11.060-001', type: 'Parceria' },
    { region: 'Interior de São Paulo', name: 'São Bernardo do Campo (SP)', address: 'Rua José Versolato, 111, Bloco B, Sala 3102', cep: '09750-730', type: 'Própria' },
    { region: 'Interior de São Paulo', name: 'São José dos Campos (SP)', address: 'Av. Alfredo Ignácio Nogueira Penido, 335, Sala 706', cep: '12246-000', type: 'Parceria' },
    { region: 'Interior de São Paulo', name: 'Sorocaba (SP)', address: 'Rua Horácio Cenci, 9, Sala 605', cep: '18048-120', type: 'Própria' },
    
    // Unidades no Rio de Janeiro
    { region: 'Rio de Janeiro', name: 'Ipanema (RJ) - Unidade 1', address: 'Av. Visconde de Pirajá, 550, Sala 1503', cep: '22410-901', type: 'Parceria' },
    { region: 'Rio de Janeiro', name: 'Ipanema (RJ) - Unidade 2', address: 'Av. Visconde de Pirajá, 414, Sala 718', cep: '22410-002', type: 'Própria' },
    { region: 'Rio de Janeiro', name: 'Niterói (RJ)', address: 'Estr. Francisco da Cruz Nunes, 5982, Sala 204, Piratininga', cep: '24350-190', type: 'Parceria' },
    
    // Unidades na Região Sul
    { region: 'Região Sul', name: 'Blumenau (SC)', address: 'Rua 15 de novembro, 727, 2° andar', cep: '89010-001', type: 'Parceria' },
    { region: 'Região Sul', name: 'Cascavel (PR)', address: 'Rua Presidente Kennedy, 481, Centro', cep: '85810-040', type: 'Parceria' },
    { region: 'Região Sul', name: 'Curitiba (PR)', address: 'Praça São Paulo da Cruz, 50, Sala 1904', cep: '80030-480', type: 'Própria' },
    { region: 'Região Sul', name: 'Florianópolis (SC)', address: 'Av. Prefeito Osmar Cunha, 416, Sala 1108, Centro', cep: '88015-100', type: 'Própria' },
    { region: 'Região Sul', name: 'Itajaí (SC)', address: 'Rua Olímpio Miranda Júnior, 168, Salas 10 e 11, Centro', cep: '88.301-080', type: 'Parceria' },
    { region: 'Região Sul', name: 'Joinville (SC)', address: 'Rua Armando Oliveira Andrade, 97, Bom Retiro', cep: '89.223-066', type: 'Parceria' },
    { region: 'Região Sul', name: 'Maringá (PR)', address: 'Avenida Cerro Azul, 748, Sala 109', cep: '87010-000', type: 'Parceria' },
    { region: 'Região Sul', name: 'Porto Alegre (RS)', address: 'Avenida Carlos Gomes, 700, Sala 606, Auxiliadora', cep: '90480-000', type: 'Própria' },
    { region: 'Região Sul', name: 'São José (SC)', address: 'Rua Alvaro Tolentino, 30, Campinas', cep: '88.101-240', type: 'Parceria' },
    
    // Unidades na Região Centro-Oeste
    { region: 'Região Centro-Oeste', name: 'Anápolis (GO)', address: 'Av. Cerejeiras, Quadra 17, Lote 08', cep: '75097-154', type: 'Parceria' },
    { region: 'Região Centro-Oeste', name: 'Brasília (DF) - Unidade 1', address: 'SCR/SUL, Quadra 516, Bloco O, Sala 656', cep: '70092-900', type: 'Parceria' },
    { region: 'Região Centro-Oeste', name: 'Brasília (DF) - Unidade 2', address: 'Quadra 701, Bloco B, nº 69, Pavimento Superior, Asa Sul', cep: '70.381-525', type: 'Parceria' },
    { region: 'Região Centro-Oeste', name: 'Brasília (DF) - Unidade 3', address: 'SHI/S QI 7, Bloco B, Sala 201', cep: '71615-720', type: 'Parceria' },
    { region: 'Região Centro-Oeste', name: 'Brasília (DF) - Unidade 4', address: 'SGAS 915, Bloco D, Sala 103, Asa Sul', cep: '70390-150', type: 'Própria' },
    { region: 'Região Centro-Oeste', name: 'Campo Grande (MS)', address: 'Av. Afonso Pena, 4785, Sala 701', cep: '79031-010', type: 'Própria' },
    { region: 'Região Centro-Oeste', name: 'Cuiabá (MT)', address: 'Rua Tiradentes, 220, Bairro Pico Do Amor', cep: '78065-075', type: 'Parceria' },
    { region: 'Região Centro-Oeste', name: 'Goiânia (GO)', address: 'Av. Portugal, 1148, Sala C 2501', cep: '74150-030', type: 'Própria' },
    
    // Unidades na Região Nordeste
    { region: 'Região Nordeste', name: 'Aracaju (SE) - Unidade 1', address: 'Rua Lagarto, 1624, São José', cep: '49015-270', type: 'Parceria' },
    { region: 'Região Nordeste', name: 'Aracaju (SE) - Unidade 2', address: 'Rua Riachuelo, 1200, São José', cep: '49015-160', type: 'Parceria' },
    { region: 'Região Nordeste', name: 'Caruaru (PE) - Unidade 1', address: 'Av. Dr. Pedro Jordão, 419, Maurício de Nassau', cep: '55012-640', type: 'Parceria' },
    { region: 'Região Nordeste', name: 'Caruaru (PE) - Unidade 2', address: 'Rua Artur Antônio da Silva, S/N, Universitário, Sala 1901', cep: '55016-445', type: 'Própria' },
    { region: 'Região Nordeste', name: 'Fortaleza (CE)', address: 'Rua Monsenhor Bruno, 1153, Sala 1423', cep: '60115-191', type: 'Própria' },
    { region: 'Região Nordeste', name: 'João Pessoa (PB)', address: 'Av. Dom Pedro I, 719, Sala 104, Tambiá', cep: '58.020-514', type: 'Parceria' },
    { region: 'Região Nordeste', name: 'Lauro de Freitas (BA)', address: 'Av. Praia de Pajussara, 294, Vilas do Atlântico', cep: '42.708-720', type: 'Parceria' },
    { region: 'Região Nordeste', name: 'Maceió (AL)', address: 'Av. Fernandes Lima, 8, 4º andar, Salas 418 e 419, Farol', cep: '57.055-000', type: 'Parceria' },
    { region: 'Região Nordeste', name: 'Natal (RN) - Unidade 1', address: 'Av. Miguel Alcides Araújo, 1920, Térreo', cep: '59078-270', type: 'Parceria' },
    { region: 'Região Nordeste', name: 'Natal (RN) - Unidade 2', address: 'Rua Doutor Poty Nobrega, 1946, Sala 1805, Lagoa Nova', cep: '59056-180', type: 'Própria' },
    { region: 'Região Nordeste', name: 'Natal (RN) - Unidade 3', address: 'Av. Amintas Barros, 3700, sala 708, bloco A', cep: '59075-810', type: 'Própria' },
    { region: 'Região Nordeste', name: 'Olinda (PE)', address: 'Av. Presidente Getúlio Vargas, 1605, Loja 09', cep: '53030-010', type: 'Parceria' },
    { region: 'Região Nordeste', name: 'Recife (PE)', address: 'Av. República do Líbano, 251, Torre A, Sala 2205', cep: '51110-160', type: 'Própria' },
    { region: 'Região Nordeste', name: 'Salvador (BA)', address: 'Av. Tancredo Neves, 2539, Torre Londres, Sala 2609', cep: '41820-910', type: 'Própria' },
    { region: 'Região Nordeste', name: 'São Luís (MA)', address: 'Av. Cel. Colares Moreira, 444, Sala 649B, Jardim Renascença', cep: '65075-441', type: 'Parceria' },
    { region: 'Região Nordeste', name: 'Teresina (PI) - Unidade 1', address: 'Rua Thomas Edson, 2203, Horto', cep: '64.052-770', type: 'Parceria' },
    { region: 'Região Nordeste', name: 'Teresina (PI) - Unidade 2', address: 'Av. Universitária, 750, Sala 1114, Torre Office', cep: '64049-494', type: 'Própria' },
    
    // Unidades na Região Norte
    { region: 'Região Norte', name: 'Belém (PA)', address: 'Rua Avertano Rocha, 192, Campina', cep: '66.023-120', type: 'Parceria' },
    { region: 'Região Norte', name: 'Boa Vista (RR)', address: 'Av. General Ataíde Teive, 832, Mecejana', cep: '69304-360', type: 'Parceria' },
    { region: 'Região Norte', name: 'Macapá (AP)', address: 'Av. dos Caramuru, 1293-A, Buritizal', cep: '68902-863', type: 'Parceria' },
    { region: 'Região Norte', name: 'Manaus (AM)', address: 'Rua Diamante, 278, Nossa Senhora das Graças', cep: '69053-700', type: 'Parceria' },
    { region: 'Região Norte', name: 'Palmas (TO)', address: 'AV LO 05, nº 22, Plano Diretor Sul', cep: '77.021-026', type: 'Parceria' },
    { region: 'Região Norte', name: 'Porto Velho (RO)', address: 'Av. Sete de Setembro, 1925', cep: '76.804-123', type: 'Parceria' },
    { region: 'Região Norte', name: 'Rio Branco (AC)', address: 'Rua Floriano Peixoto, 883, Centro', cep: '69.900-090', type: 'Parceria' },
    
    // Unidades em Minas Gerais
    { region: 'Minas Gerais', name: 'Belo Horizonte (MG)', address: 'Rua Rio Grande do Norte, 1435, Sala 708, Funcionários', cep: '30130-138', type: 'Própria' },
    { region: 'Minas Gerais', name: 'Montes Claros (MG)', address: 'Rua Padre Augusto, 16, Sala 302, Centro', cep: '39.400-053', type: 'Parceria' },
    { region: 'Minas Gerais', name: 'Uberlândia (MG)', address: 'Av. Doutor Jaime Ribeiro da Luz, 971, Sala 52, Santa Monica', cep: '38.408-188', type: 'Parceria' },
    
    // Unidades Internacionais
    { region: 'Internacionais', name: 'Miami (EUA)', address: '2801 N.W. 74th Avenue, Suite 211, Flórida', cep: '33122', type: 'Parceria' },
    { region: 'Internacionais', name: 'Santiago (Chile) - Las Condes', address: 'Av. Apoquindo, 6410, Oficina 606', type: 'Própria' },
    { region: 'Internacionais', name: 'Santiago (Chile) - Providencia', address: 'Santa Beatriz, 170, Oficina 903', type: 'Própria' },
    { region: 'Internacionais', name: 'Santiago (Chile) - Ñuñoa', address: 'Av. Irarrázaval, 2401, Oficina 901', type: 'Própria' },
    { region: 'Internacionais', name: 'Santiago (Chile) - Lo Barnechea', address: 'Av. La Dehesa, 1822, Oficina 705', type: 'Própria' },
    { region: 'Internacionais', name: 'Santiago (Chile) - Centro', address: 'Ahumada, 236, Oficina 501', type: 'Própria' },
];
