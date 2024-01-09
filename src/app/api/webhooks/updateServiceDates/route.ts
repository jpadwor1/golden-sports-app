import { db } from '@/db';
import { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const customers = await db.customer.findMany({
      where: {
        nextServiceDate: {
          lt: new Date(), // 'less than' current date
        },
      },
    });

    const updatedCustomers = await Promise.all(
      customers.map(async (customer) => {
        return await db.customer.update({
          where: {
            id: customer.id,
          },
          data: {
            lastServiceDate: customer.nextServiceDate,
            nextServiceDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set to 7 days later
          },
        });
      })
    );

    return new Response('Hello, Next.js!', {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response('error', {
      status: 500,
    });
  }
}

// export const notAllowedHandler = (req: NextApiRequest, res: NextApiResponse) => {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
