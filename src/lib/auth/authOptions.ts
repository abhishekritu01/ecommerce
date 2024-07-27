import GoogleProvider from "next-auth/providers/google";
import { db } from "../db/db";
import { user } from "../db/schema";
import { AuthOptions } from "next-auth";



export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

            async profile(profile, token: any) {
                console.log('profile', profile)
                console.log('tokens', token)

                const data = {
                    fname: profile.given_name,
                    lname: profile.family_name,
                    email: profile.email,
                    provider: 'google',
                    extrnalID: profile.sub,
                    image: profile.picture,

                }
                try {
                    const users = await db
                        .insert(user).values(data)
                        .onConflictDoUpdate({ target: user.email, set: data })
                        .returning();

                    return {
                        ...data,
                        name: data.fname,
                        id: String(users[0].id),
                        role: users[0].role
                    }
                } catch (error) {
                    console.log(error)
                    return {
                        error: 'Something went wrong',
                        id: ""
                    }
                }
            }
        })
    ],

    callbacks: {
        session(data: any) {
            return data
        },

        jwt({ token, user }: { token: any, user: any }) {
            {
                if (user) {
                    token.id = user.id;
                    token.role = user.role;
                }
                return token
            }

        }
    }
}