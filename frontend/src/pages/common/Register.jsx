import { Button, Form as SemanticForm, Input } from 'semantic-ui-react';
import { Formik, useField } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../../api/user';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('El nombre de usuario es obligatorio')
    .matches(/^\S+$/, 'El nombre de usuario no puede contener espacios'),
  email: Yup.string()
    .email('Ingresa un email válido')
    .required('El email es obligatorio'),
  password: Yup.string()
    .required('La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .matches(/[0-9]/, 'Debe contener al menos un número')
    .matches(/[^a-zA-Z0-9\s]/, 'Debe contener al menos un carácter especial'),
  confirmPassword: Yup.string()
    .required('Confirma tu contraseña')
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),
});

function FormInput({ name, label, type = 'text', placeholder }) {
  const [field, meta] = useField(name);
  return (
    <SemanticForm.Field error={meta.touched && Boolean(meta.error)}>
      <label>{label}</label>
      <Input {...field} type={type} placeholder={placeholder} />
      {meta.touched && meta.error && (
        <div className="ui red pointing prompt label">{meta.error}</div>
      )}
    </SemanticForm.Field>
  );
}

export function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      toast.success('Registro exitoso. Ya puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'No se pudo completar el registro');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="ui header">Crear cuenta</h2>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: onSubmit, isSubmitting }) => (
          <SemanticForm className="ui form" onSubmit={onSubmit}>
            <FormInput
              name="username"
              label="Nombre de usuario"
              placeholder="sin espacios"
            />
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="correo@ejemplo.com"
            />
            <FormInput
              name="password"
              label="Contraseña"
              type="password"
              placeholder="Mínimo 8 caracteres"
            />
            <FormInput
              name="confirmPassword"
              label="Confirmar contraseña"
              type="password"
              placeholder="Repite la contraseña"
            />
            <Button type="submit" primary fluid loading={isSubmitting}>
              Registrarse
            </Button>
          </SemanticForm>
        )}
      </Formik>
    </div>
  );
}
