import { Button, Form as SemanticForm, Input } from 'semantic-ui-react';
import { Formik, useField } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTokenPair } from '../../api/token';
import { useAuth } from '../../hooks/useAuth';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Ingresa un email válido')
    .required('El email es obligatorio'),
  password: Yup.string().required('La contraseña es obligatoria'),
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

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data = await getTokenPair(values.email, values.password);
      console.log(data.access);
      await login(data.access);
      toast.success('Sesión iniciada correctamente');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'No se pudo iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="ui header">Iniciar sesión</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: onSubmit, isSubmitting }) => (
          <SemanticForm className="ui form" onSubmit={onSubmit}>
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
              placeholder="••••••••"
            />
            <Button type="submit" primary fluid loading={isSubmitting}>
              Entrar
            </Button>
          </SemanticForm>
        )}
      </Formik>
    </div>
  );
}
