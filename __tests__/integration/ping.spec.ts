
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    counter: {
      create: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

// 2. Import after mock is registered
//    `prisma` is the exact instance created by `new PrismaClient()` in server.ts,
//    so its methods are already jest.fn()s we can control directly.
import { prisma, server } from '../../app';

const mockCreate = prisma.counter.create as jest.Mock;
const mockCount = prisma.counter.count as jest.Mock;

describe('GET /ping', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  })

  it('returns 200 with the current counter count', async () => {
    //arrange
    mockCreate.mockResolvedValueOnce({});
    mockCount.mockResolvedValueOnce(42);

    //act
    const response = await server.inject({
      method: 'GET',
      url: '/ping',
    });

    //assert
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ count: 42 });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({ data: {} });
    expect(mockCount).toHaveBeenCalledTimes(1);
  });

  it('increments the count on each call', async () => {
    //arrange
    mockCreate.mockResolvedValue({});
    mockCount
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2);

    //act
    const first = await server.inject({ method: 'GET', url: '/ping' });
    const second = await server.inject({ method: 'GET', url: '/ping' });

    //assert
    expect(first.json()).toEqual({ count: 1 });
    expect(second.json()).toEqual({ count: 2 });
  });

  it('returns 500 when prisma.counter.create throws', async () => {
    //arrange
    mockCreate.mockRejectedValueOnce(new Error('DB connection failed'));

    //act
    const response = await server.inject({
      method: 'GET',
      url: '/ping',
    });

    //assert
    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: 'DB connection failed' });
    expect(mockCount).not.toHaveBeenCalled();
  });
});