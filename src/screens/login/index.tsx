import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Camera, ImageUp, LogIn, QrCode } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera as ExpoCamera } from 'expo-camera';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSession } from '@/hooks/use-session';
import { ApiError } from '@/services/api';
import { loginDelegate } from '@/services/delegate-auth';
import { normalizeEmail, normalizeRegistrationCode } from '@/utils/registration-code';
import { colors, fontFamily, fontSize, radius, spacing, textStyles } from '@/theme';
import { QrScanner } from './qr-scanner';

const NOT_A_REGISTRATION_QR = "That QR code isn't an APTICON registration QR. Try again or type your code.";

export function LoginScreen() {
  const router = useRouter();
  const { signIn } = useSession();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const applyScannedText = (raw: string) => {
    const scanned = normalizeRegistrationCode(raw);
    if (scanned) {
      setCode(scanned);
      setError(null);
    } else {
      setError(NOT_A_REGISTRATION_QR);
    }
  };

  const handleUpload = async () => {
    setError(null);
    try {
      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });
      if (picked.canceled || !picked.assets?.[0]) return;
      const results = await ExpoCamera.scanFromURLAsync(picked.assets[0].uri, ['qr']);
      if (results.length === 0) {
        setError('No QR code found in that image. Pick a clear screenshot of your registration QR.');
        return;
      }
      applyScannedText(results[0].data);
    } catch {
      setError('Could not read that image. Try another one or type your code.');
    }
  };

  const handleSubmit = async () => {
    const registrationCode = normalizeRegistrationCode(code);
    const normalizedEmail = normalizeEmail(email);
    if (!registrationCode) {
      setError('Enter or scan your registration code.');
      return;
    }
    if (!normalizedEmail) {
      setError('Enter the email address you registered with.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const result = await loginDelegate(registrationCode, normalizedEmail);
      await signIn(result);
      // The root layout's Stack.Protected guard closes this screen once the session exists.
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <ScreenHeader
            eyebrow="Delegate Login"
            title="Welcome, Delegate"
            subtitle="Scan the QR code from your registration email and enter the email you registered with."
          />

          <View style={styles.body}>
            {scanning ? (
              <QrScanner
                onClose={() => setScanning(false)}
                onScanned={(data) => {
                  setScanning(false);
                  applyScannedText(data);
                }}
              />
            ) : (
              <View style={styles.actions}>
                <Button icon={Camera} onPress={() => setScanning(true)}>
                  Scan QR
                </Button>
                <Button icon={ImageUp} variant="secondary" onPress={() => void handleUpload()}>
                  Upload QR image
                </Button>
              </View>
            )}

            <Card style={styles.form}>
              <Text style={styles.label}>Registration code</Text>
              <View style={styles.codeRow}>
                <QrCode color={colors.text.faint} size={18} />
                <TextInput
                  style={styles.input}
                  value={code}
                  onChangeText={(text) => setCode(text.toUpperCase())}
                  placeholder="e.g. AM1001"
                  placeholderTextColor={colors.text.faint}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={40}
                  accessibilityLabel="Registration code"
                />
              </View>

              <Text style={styles.label}>Registered email</Text>
              <TextInput
                style={[styles.input, styles.emailInput]}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.text.faint}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                maxLength={200}
                accessibilityLabel="Registered email"
                onSubmitEditing={() => void handleSubmit()}
              />

              {error ? (
                <Text style={styles.error} accessibilityRole="alert">
                  {error}
                </Text>
              ) : null}

              <Button icon={LogIn} disabled={submitting} onPress={() => void handleSubmit()}>
                {submitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </Card>

            <Button variant="ghost" onPress={() => router.back()}>
              Continue as guest
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: spacing['3xl'] },
  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.lg },
  actions: { gap: spacing.sm },
  form: { gap: spacing.sm },
  label: { ...textStyles.label, marginTop: spacing.xs },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface[300],
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface[50],
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.md,
    color: colors.text.dark,
    paddingVertical: spacing.md,
  },
  emailInput: {
    flex: 0,
    borderWidth: 1,
    borderColor: colors.surface[300],
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface[50],
    marginBottom: spacing.sm,
  },
  error: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
    color: '#B91C1C',
    marginBottom: spacing.sm,
  },
});
