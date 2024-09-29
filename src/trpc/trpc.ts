import { initTRPC } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-openapi";
import { currentUser } from "@clerk/nextjs/server";

const t = initTRPC.meta<OpenApiMeta>().create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
