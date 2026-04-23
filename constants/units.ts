export interface Unit {
    name: string;
    address: string;
    cep?: string;
    type: 'Própria' | 'Parceria';
    region: string;
    hasRoom: boolean;
}

export const units: Unit[] = [
    // São Paulo (Capital e RM)
    { region: 'São Paulo (Capital e RM)', name: 'Alphaville (SP)', address: 'Alameda Rio Negro, 503 - Alphaville, Barueri', cep: '06454-000', type: 'Própria', hasRoom: true },
    { region: 'São Paulo (Capital e RM)', name: 'Berrini 1 (SP)', address: 'Rua André Ampere , 153-159', cep: '04562-080', type: 'Parceria', hasRoom: false },
    { region: 'São Paulo (Capital e RM)', name: 'Berrini 2 (SP)', address: 'Av. Engenheiro Luís Carlos Berrini, 1748 - Cidade Monções', cep: '04571-000', type: 'Própria', hasRoom: true },
    { region: 'São Paulo (Capital e RM)', name: 'Faria Lima 1 (SP)', address: 'Av. Brigadeiro Faria Lima, 2369 - Jardim Paulistano', cep: '01452-000', type: 'Própria', hasRoom: true },
    { region: 'São Paulo (Capital e RM)', name: 'Faria Lima 2 (SP)', address: 'Avenida Brigadeiro Faria Lima, 1811, Jardim Paulistano', cep: '01452-001', type: 'Própria', hasRoom: false },
    { region: 'São Paulo (Capital e RM)', name: 'Guarulhos (SP)', address: 'Av. Salgado Filho, 2120 e 2150 - Torre C', cep: '07115-000', type: 'Própria', hasRoom: false },
    { region: 'São Paulo (Capital e RM)', name: 'Osasco (SP)', address: 'Av dos Autonomistas, no 896, Anexo 900, Vila Yara', cep: '06020-010', type: 'Parceria', hasRoom: false },
    { region: 'São Paulo (Capital e RM)', name: 'Paulista 1 (SP)', address: 'Avenida Paulista, 171 - Bela Vista', cep: '01311-904', type: 'Própria', hasRoom: true },
    { region: 'São Paulo (Capital e RM)', name: 'Paulista 2 (SP)', address: 'Avenida Paulista, 1636 - Cerqueira Cesar', cep: '01310-200', type: 'Própria', hasRoom: true },
    { region: 'São Paulo (Capital e RM)', name: 'Paulista 4 (SP)', address: 'Av. Paulista 91', cep: '01311-000', type: 'Própria', hasRoom: false },
    { region: 'São Paulo (Capital e RM)', name: 'Tatuapé (SP)', address: 'Rua Serra de Botucatu, 880', cep: '03317-000', type: 'Própria', hasRoom: false },
    { region: 'São Paulo (Capital e RM)', name: 'Verbo Divino (SP)', address: 'Avenida Nossa Senhora da Penha, 2598, Santa Luiza', cep: '04719-002', type: 'Própria', hasRoom: true },
    { region: 'São Paulo (Capital e RM)', name: 'Vila Leopoldina (SP)', address: 'Av. Mofarrej, 348 - Vila Leopoldina', cep: '05311-000', type: 'Própria', hasRoom: true },

    // Interior de São Paulo
    { region: 'Interior de São Paulo', name: 'Assis (SP)', address: 'Rua Mauri Torreti, 60, Portal São Francisco', cep: '19807-466', type: 'Parceria', hasRoom: false },
    { region: 'Interior de São Paulo', name: 'Campinas (SP)', address: 'Av. José de Souza Campos, 1073 - Cambuí', cep: '13025-320', type: 'Própria', hasRoom: false },
    { region: 'Interior de São Paulo', name: 'Jundiaí (SP)', address: 'Rua Anchieta, no 204, Vila Boaventura, Jundiaí/SP', cep: '13201-804', type: 'Parceria', hasRoom: false },
    { region: 'Interior de São Paulo', name: 'Ribeirão Preto (SP)', address: 'Rua Ayrton Roxo, 901, Alto da Boa Vista', cep: '14025-270', type: 'Parceria', hasRoom: false },
    { region: 'Interior de São Paulo', name: 'Ribeirão Preto (SP)', address: 'Avenida Doutor Plínio de Castro Prado, 288, Jardim Palma Travassos', cep: '14091-170', type: 'Própria', hasRoom: false },
    { region: 'Interior de São Paulo', name: 'Santos (SP)', address: 'Avenida Ana Costa, n° 61, Térreo, Gonzaga', cep: '11060-001', type: 'Parceria', hasRoom: false },
    { region: 'Interior de São Paulo', name: 'São Bernardo do Campo (SP)', address: 'Rua José Versolato, 111, Bloco B', cep: '09750-730', type: 'Própria', hasRoom: false },
    { region: 'Interior de São Paulo', name: 'São José dos Campos (SP)', address: 'Av. Alfredo Ignácio Nogueira Penido, 335', cep: '12246-000', type: 'Parceria', hasRoom: false },
    { region: 'Interior de São Paulo', name: 'Sorocaba (SP)', address: 'Rua Horacio Cenci, 9', cep: '18048-120', type: 'Própria', hasRoom: false },

    // Minas Gerais
    { region: 'Minas Gerais', name: 'Belo Horizonte (MG)', address: 'Rua Rio Grande do Norte, 1435 - Funcionários', cep: '30130-138', type: 'Própria', hasRoom: false },
    { region: 'Minas Gerais', name: 'Montes Claros (MG)', address: 'Rua Padre Augusto, n 16, Centro', cep: '39400-053', type: 'Parceria', hasRoom: false },
    { region: 'Minas Gerais', name: 'Uberlândia (MG)', address: 'Av Doutor Jaime Ribeiro da Luz, no 971, Santa Monica', cep: '38408-188', type: 'Parceria', hasRoom: false },

    // Rio de Janeiro
    { region: 'Rio de Janeiro', name: 'Rio de Janeiro 1 (RJ)', address: 'Av Visconde de Pirajá, 550, Ipanema - Rio de Janeiro', cep: '22410-901', type: 'Parceria', hasRoom: false },
    { region: 'Rio de Janeiro', name: 'Rio de Janeiro 2 (RJ)', address: 'Av Visconde de Pirajá, 414, Ipanema - Rio de Janeiro', cep: '22410-002', type: 'Própria', hasRoom: true },
    { region: 'Rio de Janeiro', name: 'Niterói (RJ)', address: 'Estr. Francisco da Cruz Nunes, 5982, Piratininga', cep: '24350-190', type: 'Parceria', hasRoom: false },

    // Região Sul
    { region: 'Região Sul', name: 'Blumenau (SC)', address: 'Rua 15 de novembro, 727, 2° andar, centro', cep: '89010-001', type: 'Parceria', hasRoom: false },
    { region: 'Região Sul', name: 'Cascavel (PR)', address: 'R Presidente Kennedy, 481, Centro, Cascavel/PR', cep: '85810-040', type: 'Parceria', hasRoom: false },
    { region: 'Região Sul', name: 'Curitiba (PR)', address: 'Praça São Paulo da Cruz, 50', cep: '80030-480', type: 'Própria', hasRoom: true },
    { region: 'Região Sul', name: 'Florianópolis (SC)', address: 'Av. Prefeito Osmar Cunha, 416, Centro', cep: '88015-100', type: 'Própria', hasRoom: false },
    { region: 'Região Sul', name: 'Itajaí (SC)', address: 'Rua Olímpio Miranda Junior, no 168, Centro', cep: '88301-080', type: 'Parceria', hasRoom: false },
    { region: 'Região Sul', name: 'Joinville (SC)', address: 'Rua Armando Andrade, no 97, Bom Retiro, Joinville (SC)', cep: '89223-066', type: 'Parceria', hasRoom: false },
    { region: 'Região Sul', name: 'Maringá (PR)', address: 'Avenida Cerro Azul, 748', cep: '87010-000', type: 'Parceria', hasRoom: false },
    { region: 'Região Sul', name: 'Porto Alegre (RS)', address: 'Avenida Carlos Gomes, 700 - Auxiliadora', cep: '90480-000', type: 'Própria', hasRoom: false },
    { region: 'Região Sul', name: 'São José (SC)', address: 'Rua Alvaro Tolentino, no 30, Campinas', cep: '88101-240', type: 'Parceria', hasRoom: false },

    // Região Centro-Oeste
    { region: 'Região Centro-Oeste', name: 'Anápolis (GO)', address: 'Avenida Cerejeiras, S/N, Quadra 17, Lote 08, Residencial Cerejeiras', cep: '75097-154', type: 'Parceria', hasRoom: false },
    { region: 'Região Centro-Oeste', name: 'Brasília 1 (DF)', address: 'Quadra 701 Bloco O - Bairro Asa Sul', cep: '70092-900', type: 'Parceria', hasRoom: false },
    { region: 'Região Centro-Oeste', name: 'Brasília 2 (DF)', address: 'V W3, SCR/SUL, Quadra 516, Bloco B no 69, Pavimento Superior, Asa Sul', cep: '70381-525', type: 'Parceria', hasRoom: false },
    { region: 'Região Centro-Oeste', name: 'Brasília 3 (DF)', address: 'SHI/S QI 7 COMERCIO LOCAL BL B SL 201', cep: '71615-720', type: 'Parceria', hasRoom: false },
    { region: 'Região Centro-Oeste', name: 'Brasilia 4 (DF)', address: 'SGAS 915, BLOCO D, Asa Sul, Brasilia, DF', cep: '70390-150', type: 'Própria', hasRoom: false },
    { region: 'Região Centro-Oeste', name: 'Campo Grande (MS)', address: 'Av Afonso Pena, 4785', cep: '79031-010', type: 'Própria', hasRoom: false },
    { region: 'Região Centro-Oeste', name: 'Cuiabá (MT)', address: 'Rua Tiradentes, 220, Bairro Pico Do Amor', cep: '78065-075', type: 'Parceria', hasRoom: false },
    { region: 'Região Centro-Oeste', name: 'Goiânia (GO)', address: 'Av. Portugal, 1148', cep: '74150-030', type: 'Própria', hasRoom: false },

    // Região Nordeste
    { region: 'Região Nordeste', name: 'Aracaju 1 (SE)', address: 'R LAGARTO, 1624, SAO JOSE', cep: '49015-270', type: 'Parceria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Aracaju 2 (SE)', address: 'Rua Riachuelo, 1200, São José', cep: '49015-160', type: 'Parceria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Caruaru (PE)', address: 'Av. Dr. Pedro Jordão, 419 - Maurício de Nassau', cep: '55012-640', type: 'Parceria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Caruaru (PE)', address: 'Rua Artur Antônio da Silva, S/N - Universitário', cep: '55016-445', type: 'Própria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Fortaleza (CE)', address: 'Rua Monsenhor Bruno, 1153', cep: '60115-191', type: 'Própria', hasRoom: false },
    { region: 'Região Nordeste', name: 'João Pessoa (PB)', address: 'Avenida Dom Pedro I, no 719, Tambiá, João Pessoa – PB', cep: '58020-514', type: 'Parceria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Lauro de Freitas (BA)', address: 'Av Praia de Pajussara, no 294, Vilas do Atlântico', cep: '42708-720', type: 'Parceria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Maceió (AL)', address: 'Av Fernandes Lima, no 8, Farol, Maceió/AL', cep: '57055-000', type: 'Parceria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Natal (RN)', address: 'Av. Miguel Alcídes de Araújo, 1920 - Natal', cep: '59078-270', type: 'Parceria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Natal (RN)', address: 'Rua Doutor Poty Nobrega, 1946, Lagoa Nova', cep: '59056-180', type: 'Própria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Natal 3 (RN)', address: 'Avenida Amintas Barros, 3700', cep: '59075-810', type: 'Própria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Olinda (PE)', address: 'Avenida Presidente Getúlio Vargas, 1605', cep: '53030-010', type: 'Parceria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Recife (PE)', address: 'Avenida República do Líbano, 251 - Torre A', cep: '51110-160', type: 'Própria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Salvador (BA)', address: 'Av Tancredo Neves 2539 - Torre Londres', cep: '41820-910', type: 'Própria', hasRoom: false },
    { region: 'Região Nordeste', name: 'São Luís (MA)', address: 'Av. Cel. Colares Moreira, 444 - Jardim Renascença', cep: '65075-441', type: 'Parceria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Teresina (PI)', address: 'Rua Thomas Edson, 2203, Horto', cep: '64052-770', type: 'Parceria', hasRoom: false },
    { region: 'Região Nordeste', name: 'Teresina(PI)', address: 'Avenida Universitária, N.º750', cep: '64049-494', type: 'Própria', hasRoom: false },

    // Região Norte
    { region: 'Região Norte', name: 'Belém (PA)', address: 'R. Avertano Rocha, 192, Campina', cep: '66023-120', type: 'Parceria', hasRoom: false },
    { region: 'Região Norte', name: 'Boa Vista (RR)', address: 'Avenida General Ataíde Teive, n° 832, Mecejana', cep: '69304-360', type: 'Parceria', hasRoom: false },
    { region: 'Região Norte', name: 'Macapá (AP)', address: 'Av. dos Caramuru, 1293-A - Buritizal', cep: '68902-863', type: 'Parceria', hasRoom: false },
    { region: 'Região Norte', name: 'Manaus (AM)', address: 'R. Diamante, 278 - Nossa Senhora das Graças, Manaus - AM, 69053-700, Brasil', cep: '69053-700', type: 'Parceria', hasRoom: false },
    { region: 'Região Norte', name: 'Palmas (TO)', address: 'Q ACSV SE 32 AV LO 05, no 22, Plano Diretor Sul, Palmas (TO)', cep: '77021-026', type: 'Parceria', hasRoom: false },
    { region: 'Região Norte', name: 'Porto Velho (RO)', address: 'Av Sete de Setembro, 1925', cep: '76804-123', type: 'Parceria', hasRoom: false },
    { region: 'Região Norte', name: 'Rio Branco (AC)', address: 'Rua Floriano Peixoto, 883, Centro', cep: '69900-090', type: 'Parceria', hasRoom: false },

    // Espírito Santo
    { region: 'Espírito Santo', name: 'Vitória (ES)', address: 'venida Nossa Senhora da Penha, 2598, Santa Luiza', cep: '29045-402', type: 'Parceria', hasRoom: false },

    // Internacionais
    { region: 'Internacionais', name: 'Miami (EUA)', address: 'City of Miami, in the State of Florida, located at 2801 N.W. 74th Avenue', cep: '33122', type: 'Parceria', hasRoom: false },
    { region: 'Internacionais', name: 'Las Condes (CL)', address: 'Avenida Apoquindo 6410, Las Condes, Santiago', cep: '7560903', type: 'Própria', hasRoom: false },
    { region: 'Internacionais', name: 'Providencia (CL)', address: 'Santa Beatriz 170, Providencia, Santiago', type: 'Própria', hasRoom: false },
    { region: 'Internacionais', name: 'Ñuñoa (CL)', address: 'Avenida Irarrázaval 2401, Ñuñoa', type: 'Própria', hasRoom: false },
    { region: 'Internacionais', name: 'Lo Barnechea (CL)', address: 'Avenida La Dehesa 1822, Lo Barnechea', type: 'Própria', hasRoom: false },
    { region: 'Internacionais', name: 'Centro (CL)', address: 'Ahumada 236, Centro', type: 'Própria', hasRoom: false },
];
