using System;
using System.Data;
using System.Data.Common;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace Symposium.Services.Utilities
{
    public interface IPgConnection
    {
        IDbConnection GetConnection();
        
        string Schema { get; }
    }

    public class PgConnection : IPgConnection, IDisposable
    {
        private DbConnection _connection;
        private readonly string _connectionString;

        public PgConnection(string connectionString, string schema)
        {
            _connectionString = connectionString;
            Schema = schema;
        }

        public IDbConnection GetConnection()
        {
            if (_connection != null)
            {
                return _connection;
            }

            _connection = new NpgsqlConnection(_connectionString);

            return _connection;
        }

        public string Schema { get; }

        public void Dispose()
        {
            _connection?.Dispose();
        }
    }

    public static class PgConnectionExtensions
    {
        public static IServiceCollection AddPgConnection(
            this IServiceCollection services, string connectionString, string schema)
        {
            return services.AddScoped<IPgConnection>(s => new PgConnection(connectionString, schema));
        }
    }
}