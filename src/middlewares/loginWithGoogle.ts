/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import GoogleTokenStrategy from 'passport-google-id-token'

import UserRepo from '../models/usersModel.js'
import { ApiError } from '../utils/ApiError.js'
import rolesService from '../services/rolesService.js'
import userRolesService from '../services/userRolesService.js'
import { type Types } from 'mongoose'

export function loginWithGoogle(): GoogleTokenStrategy {
  return new GoogleTokenStrategy(
    { clientID: process.env.GOOGLE_CLIENT_ID as string },
    async function (parsedToken, googleId, done) {
      console.log(
        'THIS IS USER INFO FROM GOOGLE: 😶‍🌫️😶‍🌫️😶‍🌫️',
        parsedToken.payload,
        googleId
      )
      const email = parsedToken.payload.email
      try {
        let user = await UserRepo.findOne({ email })
        const defaultRole = await rolesService.findByTitle('Borrower')

        if (!user && defaultRole != null) {
          const newUser = new UserRepo({
            firstName: parsedToken.payload.given_name,
            lastName: parsedToken.payload.family_name,
            email,
            address: 'DEFAULT',
            phoneNumber: 'DEFAULT',
            password: 'DEFAULT',
          })
          await newUser.save()

          const newRole = {
            user_id: newUser.id as Types.ObjectId,
            role_id: defaultRole.id,
          }
          await userRolesService.addRoleToUser(newRole)

          user = newUser
        }

        done(false, user)
      } catch (e) {
        return done(ApiError.forbidden('Google authentication failed'))
      }
    }
  )
}
