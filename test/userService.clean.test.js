const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Limpa', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('cria um usuário com os dados informados e status ativo', () => {
    const userData = {
      nome: 'Fulano de Tal',
      email: 'fulano@teste.com',
      idade: 25,
    };

    const createdUser = userService.createUser(
      userData.nome,
      userData.email,
      userData.idade
    );

    expect(createdUser).toMatchObject({
      nome: userData.nome,
      email: userData.email,
      idade: userData.idade,
      isAdmin: false,
      status: 'ativo',
    });
    expect(createdUser.id).toEqual(expect.any(String));
    expect(createdUser.createdAt).toEqual(expect.any(Date));
  });

  test('busca um usuário criado pelo seu identificador', () => {
    const createdUser = userService.createUser('Fulano', 'fulano@teste.com', 25);

    const foundUser = userService.getUserById(createdUser.id);

    expect(foundUser).toBe(createdUser);
  });

  test('retorna null ao buscar um identificador inexistente', () => {
    const foundUser = userService.getUserById('id-inexistente');

    expect(foundUser).toBeNull();
  });

  test('desativa um usuário comum e atualiza seu status', () => {
    const regularUser = userService.createUser('Comum', 'comum@teste.com', 30);

    const deactivated = userService.deactivateUser(regularUser.id);

    expect(deactivated).toBe(true);
    expect(userService.getUserById(regularUser.id)).toMatchObject({
      status: 'inativo',
    });
  });

  test('não desativa um usuário administrador', () => {
    const adminUser = userService.createUser('Admin', 'admin@teste.com', 40, true);

    const deactivated = userService.deactivateUser(adminUser.id);

    expect(deactivated).toBe(false);
    expect(userService.getUserById(adminUser.id)).toMatchObject({
      status: 'ativo',
    });
  });

  test('retorna false ao tentar desativar um usuário inexistente', () => {
    const deactivated = userService.deactivateUser('id-inexistente');

    expect(deactivated).toBe(false);
  });

  test('gera um relatório com os usuários cadastrados', () => {
    userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    const report = userService.generateUserReport();

    expect(report).toContain('--- Relatório de Usuários ---');
    expect(report).toContain('Nome: Alice, Status: ativo');
    expect(report).toContain('Nome: Bob, Status: ativo');
  });

  test('informa quando não há usuários cadastrados no relatório', () => {
    const report = userService.generateUserReport();

    expect(report).toBe('--- Relatório de Usuários ---\nNenhum usuário cadastrado.');
  });

  test('rejeita a criação de usuário menor de idade', () => {
    const createUser = () => userService.createUser('Menor', 'menor@email.com', 17);

    expect(createUser).toThrow('O usuário deve ser maior de idade.');
  });
});
