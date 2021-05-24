import { extend } from 'vee-validate'
import { required, email, confirmed } from 'vee-validate/dist/rules'
import { messages as messagePt } from 'vee-validate/dist/locale/pt_BR.json'

extend('required', {
    ...required,
    message: messagePt.required
})

extend('email', {
    ...email,
    message: messagePt.email
})

extend('confirmed', {
    ...confirmed,
    message: "As senhas não conferem."
})