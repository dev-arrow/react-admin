import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useCreate, useGetList, useLogin, useNotify } from 'react-admin';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Navigate } from 'react-router';

interface UserInput {
    full_name: string;
    email: string;
    password: string;
}

export const SignupPage = () => {
    const { total } = useGetList('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
    });

    const login = useLogin();
    const notify = useNotify();
    const [create] = useCreate();

    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm<UserInput>({
        mode: 'onChange',
    });

    // For the moment, we only allow one user to sign up. Other users must be created by the administrator.
    if (total) {
        return <Navigate to="/login" />;
    }

    const onSubmit: SubmitHandler<UserInput> = async data => {
        await create(
            'users',
            { data: { ...data, administrator: true } }, // The first user is an administrator
            {
                onSuccess: () => {
                    login({
                        email: data.email,
                        password: data.password,
                        redirectTo: '/contacts',
                    });
                    setTimeout(() => {
                        notify(
                            'Welcome! You can now start entering contacts, write notes and plan deals'
                        );
                    }, 0);
                },
                onError: () => {
                    notify('An error occurred. Please try again.');
                },
            }
        );
    };

    return (
        <Container maxWidth="xl" sx={{ height: '100dvh', pt: 2 }}>
            <Stack sx={{ height: '100%' }}>
                <img src="./logo192.png" alt="Atomic CRM" width={50} />

                <Container
                    maxWidth="sm"
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 1,
                    }}
                >
                    <Typography variant="h3" component="h1" gutterBottom>
                        Welcome to Atomic CRM!
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Create your account to manage your contacts, companies,
                        and deals.
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            {...register('full_name', { required: true })}
                            label="Full name"
                            variant="outlined"
                            helperText={false}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            {...register('email', { required: true })}
                            label="email"
                            type="email"
                            variant="outlined"
                            helperText={false}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            {...register('password', { required: true })}
                            label="password"
                            type="password"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!isValid}
                            >
                                Create account
                            </Button>
                        </Stack>
                    </form>
                </Container>
            </Stack>
        </Container>
    );
};

SignupPage.path = '/sign-up';
