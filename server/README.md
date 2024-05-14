# Serwer

## Konfiguracja .env
Aby uruchomić serwer, musisz utworzyć plik `.env` w katalogu `server`. Plik ten powinien posiadać następujące zmienne środowiskowe:

- `DB_URI`: URI do Twojej bazy danych MongoDB. Powinno to wyglądać mniej więcej tak: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority`
- `ACCESS_TOKEN_SECRET`: Sekret używany do podpisywania tokenów dostępu. Powinien to być długi, losowy ciąg znaków.
- `REFRESH_TOKEN_SECRET`: Sekret używany do podpisywania tokenów odświeżających. Powinien to być długi, losowy ciąg znaków.
- `EMAIL_SERVICE`: Nazwa usługi email, którą chcesz użyć do wysyłania emaili (np. 'gmail').
- `EMAIL_USER`: Adres email, z którego chcesz wysyłać maile.
- `EMAIL_PASSWORD`: Hasło do konta email, z którego chcesz wysyłać maile.

Przykładowy plik `.env` może wyglądać tak:

## Modele
Serwer składa się z różnych modeli, które są używane do strukturyzacji i manipulacji danymi. Poniżej przedstawiamy dwa z tych modeli.

## Model User

Model `User` jest używany do przechowywania informacji o użytkownikach. Zawiera następujące pola:

- `email`: Adres e-mail użytkownika. Jest to pole typu `string`.
- `passwords`: Hasło użytkownika. Jest to pole typu `string`.
- `avatar`: Avatar użytkownika. Jest to pole typu `string`.
- `roler`: Rola użytkownika. Jest to pole typu `string`.
- `savedPosts`: Zapisane posty użytkownika. Jest to pole typu `string`.
- `isEmailVerified`: Pole określające, czy e-mail użytkownika został zweryfikowany. Jest to pole typu `boolean`.

## Model Token

Model `Token` jest używany do przechowywania informacji o tokenach. Zawiera następujące pola:

- `user`: Referencja do użytkownika, który jest właścicielem tego tokena. Jest to pole typu `mongoose.Schema.Types.ObjectId`.
- `refreshToken`: Token odświeżający. Jest to pole typu `string`.
- `accessToken`: Token dostępu. Jest to pole typu `string`.
- `verificationToken`: Token weryfikacyjny. Jest to pole typu `string`.
- `createdAt`: Data i czas utworzenia tokena. Jest to pole typu `Date`.

## Model Email

Model `Email` jest używany do przechowywania informacji o e-mailach. Zawiera następujące pola:

- `email`: Adres e-mail. Jest to wymagane pole typu string.
- `verificationCode`: Kod weryfikacyjny. Jest to unikalne i wymagane pole typu string.
- `messageId`: Identyfikator wiadomości. Jest to wymagane pole typu string.
- `for`: Pole przeznaczenia. Jest to wymagane pole typu string.
- `createdAt`: Data i czas utworzenia e-maila. Jest to pole typu Date z domyślną wartością Date.now. Pole to wygasa po 1800 sekundach.

## Model Context

Model `Context` jest używany do przechowywania informacji o kontekście użytkownika. Zawiera następujące pola:

- `user`: Referencja do użytkownika, który jest właścicielem tego kontekstu. Jest to wymagane pole typu mongoose.Schema.Types.ObjectId.
- `email`: Adres e-mail użytkownika. Jest to wymagane pole typu string.
- `ip`: Adres IP użytkownika. Jest to wymagane pole typu string, które jest szyfrowane przed zapisaniem i deszyfrowane po pobraniu.
- `country`: Kraj użytkownika. Jest to wymagane pole typu string, które jest szyfrowane przed zapisaniem i deszyfrowane po pobraniu.
- `city`: Miasto użytkownika. Jest to wymagane pole typu string, które jest szyfrowane przed zapisaniem i deszyfrowane po pobraniu.
- `browser`: Przeglądarka użytkownika. Jest to wymagane pole typu string, które jest szyfrowane przed zapisaniem i deszyfrowane po pobraniu.
- `platform`: Platforma użytkownika. Jest to wymagane pole typu string, które jest szyfrowane przed zapisaniem i deszyfrowane po pobraniu.
- `os`: System operacyjny użytkownika. Jest to wymagane pole typu string, które jest szyfrowane przed zapisaniem i deszyfrowane po pobraniu.
- `device`: Urządzenie użytkownika. Jest to wymagane pole typu string, które jest szyfrowane przed zapisaniem i deszyfrowane po pobraniu.
- `deviceType`: Typ urządzenia użytkownika. Jest to wymagane pole typu string, które jest szyfrowane przed zapisaniem i deszyfrowane po pobraniu.
- `isTrusted`: Pole określające, czy kontekst jest zaufany. Jest to wymagane pole typu boolean z domyślną wartością true.
- `createdAt`: Data i czas utworzenia kontekstu. Jest to pole typu Date zarządzane automatycznie przez Mongoose.
- `updatedAt`: Data i czas ostatniej aktualizacji kontekstu. Jest to pole typu Date zarządzane automatycznie przez Mongoose.

## Model SuspiciousLogin

Model `SuspiciousLogin` jest używany do przechowywania informacji o podejrzanych próbach logowania. Zawiera następujące pola:

- `user`: Referencja do użytkownika, który próbował się zalogować. Jest to wymagane pole typu mongoose.Schema.Types.ObjectId.
- `email`: Adres e-mail użyty do próby logowania. Jest to wymagane pole typu string.
- `ip`: Adres IP użyty do próby logowania. Jest to wymagane pole typu string.
- `country`: Kraj, z którego pochodziła próba logowania. Jest to wymagane pole typu string.
- `city`: Miasto, z którego pochodziła próba logowania. Jest to wymagane pole typu string.
- `browser`: Przeglądarka użyta do próby logowania. Jest to wymagane pole typu string.
- `platform`: Platforma użyta do próby logowania. Jest to wymagane pole typu string.
- `os`: System operacyjny użyty do próby logowania. Jest to wymagane pole typu string.
- `device`: Urządzenie użyte do próby logowania. Jest to wymagane pole typu string.
- `deviceType`: Typ urządzenia użytego do próby logowania. Jest to wymagane pole typu string.
- `unverifiedAttempts`: Liczba niezweryfikowanych prób logowania. Jest to pole typu number z domyślną wartością 0.
- `isTrusted`: Pole określające, czy próba logowania jest zaufana. Jest to pole typu boolean z domyślną wartością false.
- `isBlocked`: Pole określające, czy próba logowania jest zablokowana. Jest to pole typu boolean z domyślną wartością false.

## Model Subscriber

Model `Subscriber` jest używany do przechowywania informacji o subskrybentach. Zawiera następujące pola:

- `user`: Referencja do użytkownika, który jest subskrybentem. Jest to wymagane pole typu mongoose.Schema.Types.ObjectId.
- `subscriber`: Pole określające, czy użytkownik jest subskrybentem. Jest to wymagane pole typu Boolean.
- `createdAt`: Data i czas utworzenia subskrypcji. Jest to pole typu Date z domyślną wartością Date.now.

## Model Preference

- `user`: Referencja do użytkownika, dla którego są zapisywane preferencje. Jest to unikalne i wymagane pole typu mongoose.Schema.Types.ObjectId.
- `enableContextBasedAuth`: Pole określające, czy jest włączona autentykacja oparta na kontekście. Jest to pole typu Boolean z domyślną wartością false.

## Model Log

Model `Log` przechowuje logi aplikacji. Każdy log ma powiązany adres e-mail, kontekst (który jest szyfrowany i deszyfrowany), wiadomość, typ, poziom i znacznik czasu. Istnieje również metoda do deszyfrowania kontekstu logu.

- `email`: Adres e-mail związany z logiem. Jest to opcjonalne pole typu String.
- `context`: Kontekst logu. Jest to wymagane pole typu String. Wartość tego pola jest szyfrowana przy użyciu funkcji encryptField i deszyfrowana przy użyciu funkcji decryptField.
- `message`: Wiadomość logu. Jest to wymagane pole typu String.
- `type`: Typ logu. Jest to wymagane pole typu String.
- `level`: Poziom logu. Jest to wymagane pole typu String.
- `timestamp`: Czas utworzenia logu. Jest to wymagane pole typu Date z domyślną wartością Date.now. Pole to wygasa po 604800 sekundach (1 tydzień).
- `decryptContext`: Metoda do deszyfrowania kontekstu logu. Zwraca deszyfrowaną wartość kontekstu.