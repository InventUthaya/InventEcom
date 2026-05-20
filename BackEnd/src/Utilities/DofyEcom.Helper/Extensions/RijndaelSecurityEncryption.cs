namespace DofyEcom.Helper.Extensions
{
    using System;
    using System.IO;
    using System.Security.Cryptography;

    public static class RijndaelSecurityEncryption
    {
        ////http://msdn.microsoft.com/en-us/library/system.security.cryptography.rijndael.aspx

        public static string EncryptwithRijndael(string plainText, string key, string iv)
        {
            // Check arguments.
            if (string.IsNullOrEmpty(plainText))
            {
                throw new ArgumentNullException("plainText");
            }

            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("Key");
            }

            if (string.IsNullOrEmpty(iv))
            {
                throw new ArgumentNullException("Key");
            }

            byte[] encrypted;

            // Create an Rijndael object
            // with the specified key and IV.
            using (Rijndael rijAlg = Rijndael.Create())
            {
                rijAlg.Key = StringToByteArray(key);
                rijAlg.IV = StringToByteArray(iv);

                // Create a decrytor to perform the stream transform.
                ICryptoTransform encryptor = rijAlg.CreateEncryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for encryption.
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            // Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }

                        encrypted = msEncrypt.ToArray();
                    }
                }
            }

            // Return the encrypted bytes from the memory stream.
            return ByteArrayToHexaString(encrypted);
        }

        public static string DecryptwithRijndael(string cipherText, string key, string iv)
        {
            // Check arguments.
            if (string.IsNullOrEmpty(cipherText))
            {
                throw new ArgumentNullException("cipherText");
            }

            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("Key");
            }

            if (string.IsNullOrEmpty(iv))
            {
                throw new ArgumentNullException("Key");
            }

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;

            // Create an Rijndael object
            // with the specified key and IV.
            using (Rijndael rijAlg = Rijndael.Create())
            {
                rijAlg.Key = StringToByteArray(key);
                rijAlg.IV = StringToByteArray(iv);

                // Create a decrytor to perform the stream transform.
                ICryptoTransform decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for decryption.
                using (MemoryStream msDecrypt = new MemoryStream(StringToByteArray(cipherText)))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }

            return plaintext;
        }

        public static string ByteArrayToHexaString(byte[] rijndaelEncrypted)
        {
            string hex = BitConverter.ToString(rijndaelEncrypted);
            return hex.Replace("-", string.Empty);
        }

        public static byte[] SimpleStringToByteArray(string hex)
        {
            int numberChars = hex.Length;
            byte[] bytes = new byte[numberChars / 2];
            for (int i = 0; i < numberChars; i += 2)
            {
                bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
            }

            return bytes;
        }

        public static byte[] StringToByteArray(string hex)
        {
            int numberChars = hex.Length / 2;
            byte[] bytes = new byte[numberChars];
            using (var sr = new StringReader(hex))
            {
                for (int i = 0; i < numberChars; i++)
                {
                    bytes[i] = Convert.ToByte(new string(new char[2] { (char)sr.Read(), (char)sr.Read() }), 16);
                }
            }

            return bytes;
        }
    }
}
